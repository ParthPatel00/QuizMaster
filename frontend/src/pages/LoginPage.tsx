import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn, signUp, signInWithGoogle } from "../services/authService";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  // Hook declarations
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [popup, setPopup] = useState("");
  const navigate = useNavigate();

  // Helper functions

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      setPopup("Signed in successfully! ✅");
    } catch (error) {
      setPopup(
        'Error occured during sign in 😥 Click "Sign Up" if its your first time'
      );
    }
  };

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      setPopup("Signed up successfully! ✅");
      navigate("/");
    } catch (error) {
      setPopup(
        "Error occured during sign up 😥 Ensure password is at least 8 characters long"
      );
      setEmail("");
      setPassword("");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setPopup("Signed in With Google! ✅ ");
      navigate("/");
    } catch (error) {
      setPopup("Error during Google sign-in 😥");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center by-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-8-- mb-6">
          Welcome!
        </h2>
        {popup && (
          <div className="mb-4 p-3 text-center text-white bg-red-500 rounded-lg">
            {popup}
          </div>
        )}

        <div className="space-y-4">
          {/* Google sign in button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 p-3 rounded-lg font-semibold transition"
          >
            <FcGoogle className="text-xl mr-2" />
            Sign in with Google
          </button>
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Email input box */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          ></input>

          {/* Password input box */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          ></input>
          {/* Buttons */}
          <button
            onClick={handleSignIn}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition"
          >
            Sign In
          </button>
          <button
            onClick={handleSignUp}
            className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
