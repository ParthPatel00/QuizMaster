import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth"; // your custom auth hook
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

interface Quiz {
  quiz_id: string;
  quiz_name: string;
  generated_at: string;
  document_name: string;
}

const MyQuizzesPage = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      try {
        if (!user?.email) return;
        const API_BASE_URL =
          "https://tj9hd711x4.execute-api.us-east-1.amazonaws.com/default";

        const encodedEmail = encodeURIComponent(user.email);
        const response = await fetch(
          `${API_BASE_URL}/fetchUserQuizzes?userId=${encodedEmail}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      } catch (error) {
        console.error("Error fetching user quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuizzes();
  }, [user?.email]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Quizzes</h1>
      {loading ? (
        <p>Loading...</p>
      ) : quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        quizzes.map((quiz) => (
          <Card key={quiz.quiz_id} className="mb-4 p-4">
            <h2 className="text-xl font-semibold">{quiz.quiz_name}</h2>
            <p className="text-sm text-gray-600">
              Created at:{" "}
              {new Date(quiz.generated_at).toLocaleString(undefined, {
                timeZoneName: "short",
              })}
            </p>
            <Button
              onClick={() =>
                navigate(`/quiz/${quiz.quiz_id}`, {
                  state: { quizDataState: quiz },
                })
              }
            >
              View Quiz
            </Button>
          </Card>
        ))
      )}
    </div>
  );
};

export default MyQuizzesPage;
