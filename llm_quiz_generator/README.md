
# LLM PDF Quiz Generator

## Setup

- First paste the Gemini API Key in .env file
- Create a python virtual environment using the command
```bash
  python3.12 -m venv venv
```
- Activate the virtual env using the command
```bash
  source venv/bin/activate
```
- Install the libraries in the requirements file using the command
```bash
  pip install -r requirements.txt
```


## File Structure

### lambda_function.py
#### Lambda Function for PDF Quiz Generation
- This Python module is designed to integrate with AWS Lambda and automatically generate quizzes from uploaded PDF files stored in an S3 bucket. When a PDF is uploaded, it triggers the Lambda function that processes the file, creates a quiz based on the content, and returns the result.
#### Key Components
##### 1. AWS S3 Integration
- S3 Client Initialization: The module initializes an AWS S3 client using the boto3 library. This client is used to interact with S3, such as generating pre-signed URLs for accessing PDF files.
- Presigned URL Generation: The get_presigned_url function creates a temporary, secure URL (with a 10-minute expiry) for accessing a PDF file in S3. This URL is then used by the quiz generation function to retrieve the PDF content.
##### 2. PDF Quiz Generation
- Quiz Generation Function: The process_pdf function is responsible for generating quiz questions from the PDF. It calls the generate_quiz function (imported from the pdf_quiz_generator module) by passing:
    - The URL to the PDF file.
    - The number of questions (currently set to 5).
    - The types of questions (e.g., multiple choice, true/false).
##### 3. Error Handling: If an error occurs during quiz generation, the exception is caught, logged, and a response containing an error message is returned.
#### Lambda Handler Function
##### Workflow:
- Extract the bucket name and file key from the event record.
- Generate a pre-signed URL for the PDF file.
- Process the PDF to generate a quiz using the process_pdf function.
- Log and compile the response for each file.
- Final Response: After processing all records, the Lambda returns a JSON response with a status code and the processing results for each file.
		
### pdf_quiz_generator.py
This module generates a quiz from a PDF document using Google's Gemini generative model. It extracts text from a PDF (either a local file or via URL), builds a custom prompt, and then parses the generated quiz content into a structured JSON response.
#### Function Breakdown:
##### generate_quiz(pdf_path, num_questions, question_types)
- Purpose: The main function that ties everything together.
- Process:
    - Extracts text from the PDF using extract_text().
    - Constructs a detailed prompt with create_prompt().
    - Uses the Gemini model to generate quiz content.
    - Parses the model's output into structured quiz questions with parse_quiz_response().
    - Formats and returns the final quiz or an error response in JSON.
##### extract_text(pdf_path)
- Purpose: Reads PDF content.
- Process:
    - If the PDF is via a URL, it retrieves the file using requests and extracts text from each page.
    - For local PDFs, it opens the file and extracts text using PyPDF2.
##### create_prompt(content, num_questions, types)
- Purpose: Creates a text prompt.
- Process:
    - Crafts a prompt instructing the Gemini model to generate a specified number of quiz questions.
    - Includes the required format for questions, options, answers, and explanations.
##### parse_quiz_response(response)
- Purpose: Processes the Gemini model’s raw text output.
- Process:
    - Splits the response into individual lines.
    - Extracts details (question text, question type, options, correct answer, and explanation) into structured dictionaries.
    - Returns a list of formatted quiz questions.
