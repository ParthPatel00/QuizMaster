import json
import boto3
import os
import logging
from datetime import datetime
from llm_quiz_generator.pdf_quiz_generator import generate_quiz
from botocore.exceptions import ClientError
import time
import uuid

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
quiz_table = dynamodb.Table(os.environ.get('DYNAMODB_TABLE_NAME'))

def redact_sensitive_info(data: dict) -> dict:
    """Redact sensitive information from logs"""
    if isinstance(data, dict):
        redacted = data.copy()
        # Redact sensitive fields
        sensitive_fields = ['user_id', 'email', 'api_key', 'GEMINI_API_KEY', 
                          'access_key', 'secret_key', 'password']
        for field in sensitive_fields:
            if field in redacted:
                redacted[field] = '***REDACTED***'
        return redacted
    return data

def safe_log_event(event: dict) -> dict:
    """Safely log event data by removing sensitive information"""
    try:
        # Deep copy to avoid modifying original event
        event_copy = json.loads(json.dumps(event))
        return redact_sensitive_info(event_copy)
    except Exception as e:
        logger.warning(f"Error preparing event for logging: {str(e)}")
        return {"message": "Event data unavailable for logging"}

def get_presigned_url(bucket: str, key: str, expiration: int = 600) -> str:
    """Generate a presigned URL for accessing an S3 object"""
    return s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': bucket, 'Key': key},
        ExpiresIn=expiration
    )

def store_quiz_in_dynamodb(quiz_data: dict, user_id: str, document_name: str, max_retries: int = 3) -> None:
    """Store quiz data in DynamoDB with retries"""
    logger.info(f"Attempting to store quiz in DynamoDB for document: {document_name}")
    
    retry_count = 0
    while retry_count < max_retries:
        try:
            # Add additional attributes for GSIs
            quiz_data['user_id'] = user_id
            quiz_data['document_name'] = document_name
            quiz_data['generated_at'] = datetime.now().isoformat()
            
            # Log the item size
            item_size = len(json.dumps(quiz_data).encode('utf-8'))
            logger.info(f"Quiz data size: {item_size} bytes")
            
            # Attempt to store in DynamoDB
            response = quiz_table.put_item(Item=quiz_data)
            
            # Log the DynamoDB response
            logger.info(f"DynamoDB put_item response: {json.dumps(safe_log_event(response))}")
            logger.info(f"Successfully stored quiz: {quiz_data['quiz_id']}")
            return
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            logger.error(f"DynamoDB ClientError: {error_code} - {error_message}")
            
            if error_code in ['ProvisionedThroughputExceededException', 'ThrottlingException']:
                retry_count += 1
                if retry_count < max_retries:
                    wait_time = (2 ** retry_count) * 0.1  # exponential backoff
                    logger.info(f"Retrying in {wait_time} seconds... (Attempt {retry_count + 1})")
                    time.sleep(wait_time)
                    continue
            raise
            
        except Exception as e:
            logger.error(f"Unexpected error storing quiz in DynamoDB: {str(e)}", exc_info=True)
            raise

def process_pdf(bucket: str, key: str, user_id: str) -> dict:
    """Process PDF and generate quiz"""
    logger.info(f"Starting to process PDF - Bucket: {bucket}, Key: {key}")
    
    try:
        # Generate presigned URL for PDF access
        logger.info("Generating presigned URL")
        presigned_url = get_presigned_url(bucket, key)
        
        # Generate quiz using existing function
        logger.info("Calling generate_quiz function")
        quiz_response = generate_quiz(
            pdf_path=presigned_url,
            num_questions=5,
            question_types=['multiple_choice', 'true_false']
        )
        
        # Log the raw response
        logger.info(f"Raw quiz response received, length: {len(quiz_response)}")
        
        # Parse the JSON response
        try:
            quiz_data = json.loads(quiz_response)
            
            # Ensure unique quiz_id by adding UUID
            original_quiz_id = quiz_data['quiz_id']
            unique_quiz_id = f"{original_quiz_id}_{str(uuid.uuid4())[:8]}"
            quiz_data['quiz_id'] = unique_quiz_id
            
            logger.info(f"Assigned unique quiz_id: {unique_quiz_id} for document: {key}")
            logger.info(f"Successfully parsed quiz response. Questions: {len(quiz_data.get('questions', []))}")
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse quiz response: {str(e)}")
            logger.error(f"Raw response: {quiz_response[:1000]}...")  # Log first 1000 chars
            raise
        
        # Store in DynamoDB
        logger.info(f"Attempting to store in DynamoDB for document {key} with quiz_id {quiz_data['quiz_id']}")
        store_quiz_in_dynamodb(
            quiz_data=quiz_data,
            user_id=user_id,
            document_name=key
        )
        
        logger.info(f"Successfully processed PDF: {key} with quiz_id: {quiz_data['quiz_id']}")
        return quiz_data
        
    except Exception as e:
        logger.error(f"Error processing PDF {key}: {str(e)}", exc_info=True)
        error_response = {
            "status": "error",
            "error_message": str(e),
            "metadata": {
                "source_document": key,
                "timestamp": datetime.now().isoformat()
            }
        }
        return error_response

def lambda_handler(event, context):
    """Lambda handler function"""
    logger.info(f"Lambda invoked with event: {json.dumps(safe_log_event(event), indent=2)}")
    
    try:
        # Extract information from event
        records = event.get('Records', [])
        logger.info(f"Processing {len(records)} records")
        
        responses = []
        failed_records = []
        
        for index, record in enumerate(records, 1):
            try:
                # Log safely
                safe_record = safe_log_event(record)
                logger.info(f"Processing record {index} of {len(records)}: {json.dumps(safe_record)}")
                
                # Extract S3 information
                bucket = record['s3']['bucket']['name']
                key = record['s3']['object']['key']
                
                # Log only necessary information
                logger.info(f"Processing file from bucket: {bucket}, key: {key}")
                
                # Extract user_id from metadata or context
                user_id = "default_user"  # Replace with actual user identification logic
                logger.info("Processing for user") # Don't log user_id
                
                # Process the PDF
                response = process_pdf(bucket, key, user_id)
                # Redact sensitive info before logging
                safe_response = safe_log_event(response)
                responses.append(response)
                
                logger.info(f"Successfully completed processing record {index}")
                
            except Exception as e:
                error_msg = f"Failed to process record {index}: {str(e)}"
                logger.error(error_msg, exc_info=True)
                failed_records.append({
                    "record_index": index,
                    "bucket": bucket,
                    "key": key,
                    "error": str(e)
                })
                continue  # Continue processing other records
        
        # Log summary
        logger.info(f"Completed processing {len(responses)} records successfully")
        if failed_records:
            logger.error(f"Failed to process {len(failed_records)} records: {json.dumps(failed_records)}")
        
        return {
            'statusCode': 200 if not failed_records else 207,  # 207 Multi-Status if some failed
            'body': json.dumps({
                'successful': responses,
                'failed': failed_records
            })
        }
        
    except Exception as e:
        logger.error(f"Lambda execution failed: {str(e)}", exc_info=True)
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }

# Additional utility functions for retrieving quizzes

# def get_quiz_by_id(quiz_id: str) -> dict:
#     """Retrieve a quiz by its ID"""
#     try:
#         response = quiz_table.get_item(
#             Key={'quiz_id': quiz_id}
#         )
#         return response.get('Item')
#     except Exception as e:
#         print(f"Error retrieving quiz: {str(e)}")
#         return None

# def get_quizzes_by_document(document_name: str) -> list:
#     """Retrieve all quizzes for a document"""
#     try:
#         response = quiz_table.query(
#             IndexName='DocumentIndex',
#             KeyConditionExpression='document_name = :doc',
#             ExpressionAttributeValues={
#                 ':doc': document_name
#             }
#         )
#         return response.get('Items', [])
#     except Exception as e:
#         print(f"Error retrieving quizzes by document: {str(e)}")
#         return []

# def get_quizzes_by_user(user_id: str) -> list:
#     """Retrieve all quizzes for a user"""
#     try:
#         response = quiz_table.query(
#             IndexName='UserIndex',
#             KeyConditionExpression='user_id = :uid',
#             ExpressionAttributeValues={
#                 ':uid': user_id
#             }
#         )
#         return response.get('Items', [])
#     except Exception as e:
#         print(f"Error retrieving quizzes by user: {str(e)}")
#         return [] 