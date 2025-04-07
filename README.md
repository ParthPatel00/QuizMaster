# QuizMaster

Idea: Quiz making platform AKA QuizMaster

From a user's POV:
A user should be able to create an account, or continue as guest. They should be able to upload a pdf
document such as typed notes, lecture slides, textbook chapters etc. and provide a name for the quiz
to be generated This data should be fed in an AI model such as ChatGPT, Cohere, or Deepseek. Within a
reasonable amount of time, a quiz should be generated for them. The quiz should contain a series of
questions, all visible to the user at once. Each question should be multiple
choice questions with 4 options, with only 1 being the correct option. The user should be able to complete
thequiz and submit it. Once submitted, the evalation of the quiz should be presented to the user. Questions should
be highlighted green or red based on correct and incorrect answers. A retake feature should also exist for the
user in case they want to retake the quiz. If the user has created an account.

Webpage design:
On the webpage, there should be a navbar containing "Sign up/Login","My documents" and "My quizzes" options.
The latter two options which would be empty for guest users and available only for users with an account created.

In the "My documents" page, users should be able to see a list of all documents they have uploaded and the quiz
associated with each document.

In the "My Quizzes" page, users should be able to see all the quizzes they have created in the past, the documents
associated with it, and an option to retake the quiz.

The "Sign up/Login" button should allow the user to create an account or login using Authorization, Authentication,
and Accounting.

On the landing page, there should be brief description on how "Quiz Master" works.

Below the description, there should be a "Create Quiz" button. Once clicked, the user should be prompted to enter
the name for the quiz in a text box and a button to upload a PDF document (within a certain size). Both inputs
should be mandatory.

Once the requirement is met, a "Generate quiz" button should be available to click. Once clicked, a quiz should
be generated and presented to the user.

Each question would be numbered from 1 to n, with each having 4 options, only 1 being correct. At the bottom of
the screen a submit button should allow the quiz to get scored. A correct answer should result in green feedback
and an incorrect answer should result in red. The user should be allowd to retake the quiz again shall they desire.

They should also be a button to allow the user to exit the quiz screen and return to the main menu. Exiting the screen
should automatically add the uploaded and quiz to be stored in their respective sections.

Backend:


#
