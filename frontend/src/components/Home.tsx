import { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const BUCKET_NAME = "quizmaster-pdf-uploads";

const Home = () => {
  interface params {
    Bucket: string;
    Key: string;
    Body: File;
    ContentType: string;
  }
  // Hook declarations
  //  If showForm, show the input and upload button
  const [showForm, setShowForm] = useState(false);
  // Storing name of quiz
  const [quizName, setQuizName] = useState("");
  // Storing file
  const [file, setFile] = useState<File | null>(null);
  const [sanitizedFileName, setSanitizedFileName] = useState("");
  // Storint error if invalid inputs are provided
  const [errorMessage, setErrorMessage] = useState("");
  // Is the file uploading?
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  // Helper functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileUploaded = event.target.files[0];

      // File size has to be less than 5 MB (unsure about this calculation)
      if (fileUploaded.size > 5 * 1024 * 1024) {
        setErrorMessage("File size must be less than 5MB");
        setFile(null);
        setSanitizedFileName(""); // clear any previously stored file name

        // console.log("file is larger than 5mb");
      } else {
        setErrorMessage("");
        setFile(fileUploaded);
        // Remove .pdf and replace spaces with underscores
        const sanitizedName = fileUploaded.name
          .replace(".pdf", "")
          .replace(/\s+/g, "_");

        setSanitizedFileName(sanitizedName);
        // console.log(
        //   "File uploaded: ",
        //   fileUploaded.name,
        //   "Size: ",
        //   fileUploaded.size
        // );
      }
    }
  };

  async function uploadToS3(parameters: params) {
    try {
      setIsUploading(true);
      setUploadMessage("Connecting to AWS...");
      // await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulating delay

      // 1. Get a presigned URL from the lambda function
      const api_gateway_url =
        "https://36f0au07n8.execute-api.us-east-1.amazonaws.com/Test-stage/generate-presigned-url";
      // console.log(
      //   JSON.stringify({
      //     fileName: parameters.Key,
      //     fileType: parameters.ContentType,
      //   })
      // );
      const response = await fetch(api_gateway_url, {
        method: "POST",
        body: JSON.stringify({
          fileName: parameters.Key,
          fileType: parameters.ContentType,
        }),
        headers: { "Content-Type": parameters.ContentType },
      });

      // Parse response body
      const responseData = await response.json();
      const bodyData = JSON.parse(responseData.body); // Properly parse the inner stringified JSON

      if (!bodyData.uploadUrl) {
        throw new Error("Upload URL missing in response");
      } else {
        console.log(bodyData.uploadUrl);
      }

      setUploadMessage("Uploading your file...");

      // 2. Upload the file to S3 using the presigned URL
      await fetch(bodyData.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": parameters.ContentType },
      });

      console.log(`File uploaded successfully to S3 at ${bodyData.uploadUrl}`);
      setUploadMessage("Fetching generated quiz...");
      // Fetch the quiz
      const fetchedData = await fetchQuiz(parameters.Key);

      if (!fetchedData) {
        setUploadMessage("Error: Quiz could not be generated 🫤.");
        setIsUploading(false);
        return; // Stop execution if fetching quiz fails
      }
      setUploadMessage("Quiz ready!");
      setIsUploading(false);

      navigate(`/quiz/${parameters.Key}`, {
        state: { quizDataState: fetchedData },
      });
    } catch (error) {
      console.error("Error in uploadToS3:", error);
      setUploadMessage("Upload failed. Please try again.");
      setIsUploading(false);
    }
  } // end of uploadToS3 function

  const fetchQuiz = async (
    quiz_id: string,
    maxAttempts = 25,
    delay = 2000
  ): Promise<any | null> => {
    const encodedQuizId = encodeURIComponent(quiz_id);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Fetching quiz...`);
        const response = await fetch(
          `https://tj9hd711x4.execute-api.us-east-1.amazonaws.com/default/fetchQuiz?quizId=${encodedQuizId}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Quiz data fetched:", data);
          return data;
        } else if (response.status === 404) {
          console.warn("Quiz not ready yet. Retrying...");
        } else {
          console.error(
            "Unexpected error:",
            response.status,
            response.statusText
          );
          return null;
        }
      } catch (error) {
        console.error("Fetch attempt failed:", error);
      }

      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    console.error("Failed to fetch quiz within timeout.");
    setUploadMessage("Failed to fetch quiz. Gemini timed out 🥲");
    return null;
  };
  // const fetchQuiz = async (quiz_id: string) => {
  //   await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulating delay
  //   try {
  //     const encodedQuizId = encodeURIComponent(quiz_id);
  //     console.log("Fetching quiz with:", encodedQuizId);
  //     const response = await fetch(
  //       `https://tj9hd711x4.execute-api.us-east-1.amazonaws.com/default/fetchQuiz?quizId=${encodedQuizId}`
  //     );
  //     if (!response.ok) {
  //       console.error(
  //         "Failed to fetch quiz: ",
  //         response.status,
  //         response.statusText
  //       );
  //       return null;
  //     }
  //     const data = await response.json();
  //     console.log("Quiz data fetched: ", data);
  //     return data;
  //     // navigate("/quiz", { state: { quizData: data } });
  //   } catch (error) {
  //     console.error("Error fetching quiz:", error);
  //     return null;
  //     // setLoading(false);
  //   }
  // };

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

      // const customFileName = file.name.replace(".pdf", "");
      const timestamp = Date.now();
      const userEmail = user?.email || "defaultuser";
      const sanitizedQuizName = quizName.replace(/\s+/g, "_"); // Replace spaces with underscores

      const uniqueFileName = `${sanitizedFileName}__${sanitizedQuizName}__${timestamp}__${userEmail}.pdf`;

      const parameters = {
        Bucket: BUCKET_NAME,
        Key: uniqueFileName,
        Body: file,
        ContentType: "application/pdf",
      };

      // Try to upload
      uploadToS3(parameters);
      // Need to generate a quizID somehow since each quiz is unique.
      // For now, choosing a random number, but need to look up
      // how to do this.
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4"> Introducing QuizMaster</h1>
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text animate-pulse p-5 mb-3">
        Welcome, {user?.displayName || "Quiz-Amateur"}
      </h1>
      <h2 className="text-2xl text-blue-600 font-bold mb-2">
        What the hell is QuizMaster?
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
      <h2 className="text-2xl text-blue-600 font-bold mb-2">
        Want to save your Quizzes?
      </h2>
      <p className="text-lg text-center max-w-xl mb-6">
        Signup/Login to save the documents you upload, and the quizzes you
        generate. You can retake saved quizzes, share them, or delete them
        anytime!
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
        <Card className="mt-6 mb-20 p-4 w-full max-w-lg">
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
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isUploading}
            >
              Generate Quiz
            </Button>
            {isUploading && (
              <div className="mt-4 flex items-center space-x-2">
                <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="text-gray-700">{uploadMessage}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Home;
