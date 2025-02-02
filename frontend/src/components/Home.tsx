const Home = () => {
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
        Upload your documents using the Upload documents button and effortlessly
        generate a quiz in minutes!
      </p>
    </div>
  );
};

export default Home;
