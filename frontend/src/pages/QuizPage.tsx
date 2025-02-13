import Card from "../components/ui/Card";
import { useState } from "react";
import Button from "../components/ui/Button";
import { useLocation, useNavigate } from "react-router-dom";

interface InputQuiz {
  quiz_name: string;
  questions: {
    question_text: string;
    question_type: string;
    options: string[];
    correct_answer: string;
    question_id: string;
  }[];
}

interface OutputQuiz {
  quizName: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

const convertQuizFormat = (input: InputQuiz): OutputQuiz => {
  return {
    quizName: input.quiz_name,
    questions: input.questions.map((q) => ({
      id: parseInt(q.question_id, 10),
      question: q.question_text,
      options: q.options,
      correctAnswer: q.correct_answer,
    })),
  };
};

// Moch data for the quiz. In the future this will be replaced by data from the API response
// const quizData = {
//   quizId: "12345",
//   quizName: "Computer Science",
//   questions: [
//     {
//       id: 1,
//       question: "Which of these is a low level language?",
//       options: ["Python", "C", "Assembly", "Java"],
//       correctAnswer: "Assembly",
//     },
//     {
//       id: 2,
//       question:
//         "what keyword do you use to print something on the screen in C++?",
//       options: ["printf", "cout", "cin", "cprint"],
//       correctAnswer: "cout",
//     },
//     {
//       id: 3,
//       question: "Which one of these is a compiled languate?",
//       options: ["JavaScript", "Python", "Ruby", "C++"],
//       correctAnswer: "C++",
//     },
//   ],
// }; // end of mock data

const QuizPage = () => {
  // Hook declarations
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const navigate = useNavigate();

  // const { quizId } = useParams();
  const location = useLocation();
  // const quizData = location.state?.quizDataState || null;
  const quizData: OutputQuiz | null = location.state?.quizDataState
    ? convertQuizFormat(location.state.quizDataState)
    : null;

  // console.log(convertQuizFormat(quizData));
  // Helper functions
  const handleSelectAnswer = (questionId: number, option: string) => {
    // Whichever option is selected, update/insert the questionId: option
    setSelectedAnswers((keyValue) => ({
      ...keyValue,
      [questionId]: option,
    }));
    console.log(selectedAnswers);
  };

  const handleSubmit = () => {
    if (
      !quizData ||
      Object.keys(selectedAnswers).length !== quizData.questions.length
    ) {
      setSubmissionError(
        "Please select an option for each question before submitting"
      );
      console.log(submissionError);
    } else {
      let scoreCount = 0;
      quizData.questions.forEach((q) => {
        if (selectedAnswers[q.id] == q.correctAnswer) {
          scoreCount += 1;
        }
      });
      setSubmissionError("");
      setSubmitted(true);
      setScore(scoreCount);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  const returnHomePage = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-boldm mb-4 text-gray-600">
        Quiz: {quizData?.quizName}
      </h1>
      {/* Card for the quiz */}
      <Card className="w-full max-w-2xl p-4 p-2 flex flex-col space-y-4">
        {/* Each question should be mapped along with the options */}
        {quizData?.questions.map((q) => (
          <div key={q.id} className="mb-15">
            <h2 className="text-lg font-semibold">
              {q.id}. {q.question}
            </h2>
            <div className="flex flex-col space-y-2 mt-2">
              {q.options.map((option) => {
                // Only mark the option as incorrect if its not correct, is selected, and the quiz has been submittted
                const isSelected = selectedAnswers[q.id] === option;
                const isCorrect = option === q.correctAnswer;
                const isIncorrect = isSelected && !isCorrect && submitted;
                console.log(
                  option,
                  submitted && isCorrect,
                  submitted && isIncorrect
                );
                return (
                  <button
                    key={option}
                    className={`p-2 border rounded-md text-left 
                        ${
                          submitted
                            ? isCorrect
                              ? "bg-green-200" // highlight answer in green if correct, no matter what
                              : isIncorrect
                              ? "bg-red-200" // if incorrect, then red
                              : "bg-white"
                            : isSelected
                            ? "bg-blue-200" // if quiz hasn't been submitted, blue if selected, white if not
                            : "bg-white"
                        }`}
                    onClick={() => handleSelectAnswer(q.id, option)}
                    disabled={submitted}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {/* Option ends here */}
          </div> // Div to hold contents of the quiz card
        ))}
        {!submitted ? (
          <Button onClick={handleSubmit} className="w-full mt-4">
            Submit Quiz
          </Button>
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <p className="text-lg font-semibold text-center mt-4">
              Quiz submitted! Correct answers are highlighted
            </p>
            <p
              className={`text-2xl font-bold mt-2 p-4 rounded-lg shadow-md ${
                score && score === quizData?.questions.length
                  ? "bg-green-200 text-green-800" // Perfect Score
                  : score && quizData && score >= quizData.questions.length / 2
                  ? "bg-yellow-200 text-yellow-800" // Average Score
                  : "bg-red-200 text-red-800" // Low Score
              }`}
            >
              Your Score: {score} / {quizData?.questions.length}
            </p>
            <div className="flex space-x-4 mt-4">
              <Button onClick={handleRetake}>Retake Quiz</Button>
              <Button onClick={returnHomePage}>Generate a new Quiz</Button>
            </div>
          </div>
        )}
        {submissionError && (
          <p className="text-red-500 font-medium">{submissionError}</p>
        )}
      </Card>
    </div>
  );
};

export default QuizPage;
