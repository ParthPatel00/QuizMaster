import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import QuizPage from "./pages/QuizPage";
import LoginPage from "./pages/LoginPage";
import MyQuizzesPage from "./pages/MyQuizzesPage";

function App() {
  return (
    <>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/quiz/:quizId" element={<QuizPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/my-quizzes" element={<MyQuizzesPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
