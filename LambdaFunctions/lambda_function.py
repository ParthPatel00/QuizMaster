import json
import boto3
from datetime import datetime
from llm_quiz_generator.pdf_quiz_generator import generate_quiz

# Initialize AWS clients
s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
quiz_table = dynamodb.Table('QuizSystem')

def get_presigned_url(bucket: str, key: str, expiration: int = 600) -> str:
    """Generate a presigned URL for accessing an S3 object"""
    return s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': bucket, 'Key': key},
        ExpiresIn=expiration
    )

def store_quiz_in_dynamodb(quiz_data: dict, user_id: str, document_name: str) -> None:
    """Store quiz data in DynamoDB"""
    # Add additional attributes for GSIs
    quiz_data['user_id'] = user_id
    quiz_data['document_name'] = document_name
    quiz_data['generated_at'] = datetime.now().isoformat()
    
    try:
        quiz_table.put_item(Item=quiz_data)
    except Exception as e:
        print(f"Error storing quiz in DynamoDB: {str(e)}")
        raise

def process_pdf(bucket: str, key: str, user_id: str) -> dict:
    """Process PDF and generate quiz"""
    try:
        # Generate presigned URL for PDF access
        presigned_url = get_presigned_url(bucket, key)
        
        # Generate quiz using existing function
        quiz_response = generate_quiz(
            pdf_path=presigned_url,
            num_questions=5,
            question_types=['multiple_choice', 'true_false']
        )
        
        # Parse the JSON response
        quiz_data = json.loads(quiz_response)
        
        # Store in DynamoDB
        store_quiz_in_dynamodb(
            quiz_data=quiz_data,
            user_id=user_id,
            document_name=key
        )
        
        return quiz_data
        
    except Exception as e:
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
    try:
        # Extract information from event
        records = event.get('Records', [])
        responses = []
        
        for record in records:
            # Extract S3 information
            bucket = record['s3']['bucket']['name']
            key = record['s3']['object']['key']
            
            # Extract user_id from metadata or context
            # This could come from various sources depending on your setup
            user_id = "default_user"  # Replace with actual user identification logic
            
            # Process the PDF
            response = process_pdf(bucket, key, user_id)
            responses.append(response)
        
        return {
            'statusCode': 200,
            'body': json.dumps(responses)
        }
        
    except Exception as e:
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