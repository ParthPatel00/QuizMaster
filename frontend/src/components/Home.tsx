import { useState } from "react";
import Button from "./ui/Button";

const Home = () => {
  // Hook declarations
  //  If showForm, show the input and upload button
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4"> Introducing QuizMaster</h1>
      <h2 className="text-2xl text-blue-600 font-bold mb-2">
        What is QuizMaster?
      </h2>
      <p className="text-lg text-center max-w-xl mb-6">
        An AI powered tool to generate a personalized quiz from your data!
      </p>
      <h2 className="text-2xl text-blue-600 font-bold mb-2">
        How to get started?
      </h2>
      <p className="text-lg text-center max-w-xl mb-6">
        Click the "Create Quiz" button below, give your quiz a name, upload the
        document you want to be quized in, and effortlessly generate a quiz in
        minutes!
      </p>

      <Button
        className="px-6 py-3 test-lg"
        onClick={() => setShowForm(!showForm)}
      >
        Create Quiz!
      </Button>

      {/* If the button is clicked show a form
      containing the input and upload file button */}
    </div>
  );
};

export default Home;
