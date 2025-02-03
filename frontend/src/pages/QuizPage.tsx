import Card from "../components/ui/Card";
import { useState } from "react";
import Button from "../components/ui/Button";

// Moch data for the quiz. In the future this will be replaced by data from the API response
const quizData = {
  quizId: "12345",
  quizName: "Computer Science",
  questions: [
    {
      id: 1,
      question: "Which of these is a low level language?",
      options: ["Python", "C", "Assembly", "Java"],
      correctAnswer: "Assembly",
    },
    {
      id: 2,
      question:
        "what keyword do you use to print something on the screen in C++?",
      options: ["printf", "cout", "cin", "cprint"],
      correctAnswer: "cout",
    },
    {
      id: 3,
      question: "Which one of these is a compiled languate?",
      options: ["JavaScript", "Python", "Ruby", "C++"],
      correctAnswer: "C++",
    },
  ],
}; // end of mock data

const QuizPage = () => {
  // Hook declarations
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
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
    if (Object.keys(selectedAnswers).length !== quizData.questions.length) {
      setSubmissionError(
        "Please select an option for each question before submitting"
      );
      console.log(submissionError);
    } else {
      setSubmissionError("");
      setSubmitted(true);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const returnHomePage = () => {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-boldm mb-4 text-gray-600">
        Quiz: {quizData.quizName}
      </h1>
      {/* Card for the quiz */}
      <Card className="w-full max-w-2xl p-4 p-2 flex flex-col space-y-4">
        {/* Each question should be mapped along with the options */}
        {quizData.questions.map((q) => (
          <div key={q.id} className="mb-15">
            <h2 className="text-lg font-semibold">
              {q.id}. {q.question}
            </h2>
            <div className="flex flex-col space-y-2 mt-2">
              {q.options.map((option) => {
                const isSelected = selectedAnswers[q.id] === option;
                const isCorrect = option === q.correctAnswer;
                // Only mark the option as incorrect if its not correct, is selected, and the quiz has been submittted
                const isIncorrect = !isCorrect && isSelected && submitted;
                return (
                  <button
                    key={option}
                    className={`p-2 border rounded-md text-left ${
                      isSelected ? "bg-blue-200" : "bg-white"
                    }
                      ${
                        submitted
                          ? isCorrect
                            ? "bg-green-300"
                            : isIncorrect
                            ? "bg-red-300"
                            : ""
                          : ""
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
