import { useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import { useState } from "react";

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
  ],
}; // end of mock data

const QuizPage = () => {
  // Hook declarations
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-boldm mb-4 text-gray-600">
        {quizData.quizName}
      </h1>
      {/* Card for the quiz */}
      <Card className="w-full max-w-2xl p-4 p-2 flex flex-col space-y-4">
        {/* Each question should be mapped along with the options */}
        {quizData.questions.map((q) => (
          <div key={q.id} className="mb-4">
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
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {/* Option ends here */}
          </div> // Div to hold contents of the quiz card
        ))}
      </Card>
    </div>
  );
};

export default QuizPage;
