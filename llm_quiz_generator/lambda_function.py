import json
import boto3
import os
from pdf_quiz_generator import generate_quiz

# Initialize AWS S3 client
s3 = boto3.client('s3')

def get_presigned_url(bucket_name, file_key):
    """Generate a presigned URL for the uploaded PDF."""
    url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': bucket_name, 'Key': file_key},
        ExpiresIn=600  # URL expires in 10 minutes
    )
    return url

def process_pdf(pdf_url):
    """Generate quiz for the PDF using the integrated generate_quiz function."""
    try:
        result_json = generate_quiz(
            pdf_path=pdf_url,
            num_questions=5,  # Adjust or make configurable as needed
            question_types=["multiple_choice", "true_false"]
        )
        result = json.loads(result_json)
        return result
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        return {
            "status": "error",
            "error_message": str(e)
        }

def lambda_handler(event, context):
    """Triggered when a PDF is uploaded to S3."""
    print("Event:", json.dumps(event, indent=2))
    
    responses = []
    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
        file_key = record['s3']['object']['key']

        print(f"Processing file: {file_key} from bucket: {bucket_name}")

        # Generate a presigned URL for the PDF file in S3
        pdf_url = get_presigned_url(bucket_name, file_key)

        # Process the PDF file by generating the quiz
        quiz_response = process_pdf(pdf_url)
        responses.append({
            "file": file_key,
            "response": quiz_response
        })

        print("Quiz Response:", json.dumps(quiz_response, indent=2))

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "PDF processing completed",
            "results": responses
        })
    } 