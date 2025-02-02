import { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";

const Home = () => {
  // Helper functions

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileUploaded = event.target.files[0];

      // File size has to be less than 5 MB (unsure about this calculation)
      if (fileUploaded.size > 5 * 1024 * 1024) {
        setErrorMessage("File size must be less than 5MB");
        setFile(null);
        // console.log("file is larger than 5mb");
      } else {
        setErrorMessage("");
        setFile(fileUploaded);
        // console.log(
        //   "File uploaded: ",
        //   fileUploaded.name,
        //   "Size: ",
        //   fileUploaded.size
        // );
      }
    }
  };

  const handleSubmit = () => {
    // this regex allows spaces only, not good
    // const alphanumeric = /^[a-zA-Z0-9\s]+$/;
    const alphanumeric = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]+$/;

    if (!quizName || !file) {
      setErrorMessage("Please enter a quiz name and upload a PDF");
      console.log("Please enter a quiz name and upload a PDF");
      return;
    } else if (!alphanumeric.test(quizName)) {
      setErrorMessage(
        "Quiz name must contain only letters, numbers, and spaces"
      );
      console.log("Quiz name must contain only letters, numbers, and spaces");
      return;
    } else {
      setErrorMessage("");
      console.log("Quiz name: ", quizName, "File: ", file.name);
    }
  };
  // Hook declarations
  //  If showForm, show the input and upload button
  const [showForm, setShowForm] = useState(false);
  // Storing name of quiz
  const [quizName, setQuizName] = useState("");
  // Storing file
  const [file, setFile] = useState<File | null>(null);
  // Storint error if invalid inputs are provided
  const [errorMessage, setErrorMessage] = useState("");

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
      {showForm && (
        <Card className="mt-6 p-4 w-full max-w-lg">
          <div className="p-2 flex flex-col space-y-4">
            {/* Div for text field label and input w*/}
            <div className="flex items-center space-x-2">
              <label
                className="w-40 text-lg text-blue-600 font-bold"
                htmlFor="fileName"
              >
                Quiz name:
              </label>
              <input
                type="text"
                placeholder="Name your quiz:"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                className="p-4 border rounded-md w-full"
                id="quizName"
              ></input>
            </div>
            {/*Div for file label and input */}
            <div className="flex items-center space-x-2">
              <label
                className="w-40 text-lg text-blue-600 font-bold"
                htmlFor="fileUpload"
              >
                Upload file:
              </label>
              <input
                type="file"
                accept=".pdf"
                placeholder="Upload file"
                onChange={handleFileUpload}
                className="p-4 border rounded-md w-full cursor-pointer"
                id="fileUpload"
              ></input>
            </div>
            {/* Display error message */}
            {errorMessage && (
              <p className="text-red-500 font-medium">{errorMessage}</p>
            )}
            <Button className="w-full" onClick={handleSubmit}>
              Generate Quiz
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Home;
