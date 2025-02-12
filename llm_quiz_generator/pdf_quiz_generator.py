from typing import List, Dict
import os
from dotenv import load_dotenv
import google.generativeai as genai
import PyPDF2
import json
from datetime import datetime
from pathlib import Path
# import sys
# import time
import requests
from io import BytesIO

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

#model parameters
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

#create the model
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-lite-preview-02-05",
    generation_config=generation_config,
)

def generate_quiz(
    pdf_path: str,
    num_questions: int = 5,
    question_types: List[str] = ['multiple_choice', 'true_false'],
) -> str:
    """
    Generate a quiz from a PDF document using Google's Gemini.

    Args:
        pdf_path (str): Path to the PDF file or a presigned URL of the PDF.
        num_questions (int): Number of questions to generate.
        question_types (List[str]): Allowed question types (only 'multiple_choice' and 'true_false').

    Returns:
        A JSON-formatted string with quiz questions and answers.
    """
    def extract_text(pdf_path: str) -> str:
        if pdf_path.startswith("http"):
            response = requests.get(pdf_path)
            response.raise_for_status()
            with BytesIO(response.content) as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text
            return text
        else:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text
            return text

    def create_prompt(content: str, num_questions: int, types: List[str]) -> str:
        return f"""
        Based on the following content, create {num_questions} quiz questions.
        Include a mix of {', '.join(types)} questions.

        Each question must be formatted using the following structure:
        Q: [Question text]
        Type: [question_type]    (either 'multiple_choice' or 'true_false')
        Options: [For multiple choice, provide exactly 4 comma-separated options; for true_false use "True, False"]
        A: [Correct answer]
        Explanation: [Brief explanation of the answer]

        Content:
        {content}

        Remember:
        - For multiple choice questions, provide exactly 4 options.
        - The correct answer must be one of the options.
        - For true/false questions, the options should be "True, False".
        - Ensure questions are clear and unambiguous.
        - Always include a brief explanation.
        """

    def parse_quiz_response(response: str) -> List[Dict]:
        questions = []
        current_question = {}
        for line in response.split('\n'):
            line = line.strip()
            if not line:
                continue
            if line.startswith('Q:'):
                if current_question:
                    questions.append(current_question)
                current_question = {'question_text': line[2:].strip()}
            elif line.startswith('Type:'):
                current_question['question_type'] = line[5:].strip().lower()
            elif line.startswith('Options:') and 'multiple_choice' in current_question.get('question_type', ''):
                options = [opt.strip() for opt in line[8:].split(',')]
                current_question['options'] = options
            elif line.startswith('A:'):
                current_question['correct_answer'] = line[2:].strip()
            elif line.startswith('Explanation:'):
                current_question['explanation'] = line[12:].strip()
        if current_question:
            questions.append(current_question)
        return questions

    try:
        content = extract_text(pdf_path)
        prompt = create_prompt(content, num_questions, question_types)
        response = model.generate_content(prompt)
        quiz_questions = parse_quiz_response(response.text)
        quiz_response = {
            "quiz_id": f"quiz_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "status": "success",
            "source_document": pdf_path if pdf_path.startswith("http") else Path(pdf_path).name,
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "number_of_questions": len(quiz_questions),
                "question_types_requested": question_types
            },
            "questions": [
                {
                    "question_id": f"{i+1}",
                    "question_text": q["question_text"],
                    "question_type": q["question_type"],
                    "options": q.get("options", []) if q["question_type"] == "multiple_choice" else ["True", "False"],
                    "correct_answer": q["correct_answer"],
                    "explanation": q.get("explanation", ""),
                    "metadata": {
                        "difficulty": "medium",
                        "topic": "general"
                    }
                }
                for i, q in enumerate(quiz_questions)
            ]
        }
        return json.dumps(quiz_response, indent=2)
    except Exception as e:
        error_response = {
            "status": "error",
            "error_message": str(e),
            "metadata": {
                "source_document": pdf_path if pdf_path.startswith("http") else Path(pdf_path).name,
                "timestamp": datetime.now().isoformat()
            }
        }
        return json.dumps(error_response, indent=2)

# The __main__ block is retained for testing purposes but is not required when calling generate_quiz externally.
# if __name__ == "__main__":
#     # Example usage: This code can be used to test local PDF files.
#     input_folder_path = sys.argv[1] if len(sys.argv) > 1 else input("Enter the folder path containing PDF files: ")
#     input_folder = Path(input_folder_path)
#     output_folder_path = sys.argv[2] if len(sys.argv) > 2 else input("Enter the folder path to save JSON quiz files: ")
#     output_folder = Path(output_folder_path)
#     output_folder.mkdir(parents=True, exist_ok=True)
    
#     pdf_files = list(input_folder.glob("*.pdf"))
#     if not pdf_files:
#         print(f"No PDF files found in {input_folder}")
#     else:
#         # Rate limit: 30 requests per minute.
#         requests_counter = 0
#         start_time = time.time()
#         for pdf_file in pdf_files:
#             if requests_counter >= 30:
#                 elapsed = time.time() - start_time
#                 if elapsed < 60:
#                     time.sleep(60 - elapsed)
#                 requests_counter = 0
#                 start_time = time.time()
            
#             quiz_json = generate_quiz(
#                 pdf_path=str(pdf_file),
#                 num_questions=20,
#                 question_types=["multiple_choice", "true_false"]
#             )
#             output_file = output_folder / f"{pdf_file.stem}_quiz.json"
#             with open(output_file, "w") as f:
#                 f.write(quiz_json)
#             print(f"Quiz saved for {pdf_file.name} in file {output_file}")
#             requests_counter += 1