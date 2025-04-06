import { useState } from "react";
import { Link } from "react-router-dom";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useAuth } from "../hooks/useAuth";
//import Button from "./ui/Button";
import { logOut } from "../services/authService";
import defaultUserPhoto from "../assets/user.png";

const Navbar = () => {
  const { user } = useAuth();

  // For toggling menu bar
  const [isOpen, setIsOpen] = useState(false);

  // When loggedIn true, user has loggin in, the navbar
  // will look different when logged in, compared to when not
  // logged in.
  // Will implement toggling this feature in the future
  //const [loggedIn, setLoggedIn] = useState(false);
  return (
    <nav>
      <div className="p-4 bg-blue-600 text-white">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          {/* Logo/Name of the website. Clicking this should route
        user to the home page*/}
          <Link to="/" className="text-2xl font-bold">
            QuizMaster 🧠
          </Link>
          {/* Menu button for that should only show for tablet and smaller devices*/}
          <button
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navbar"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6 text-white-800" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white-800" />
            )}
          </button>
          {/*/ The main options on the navbar */}
          <div className="hidden lg:flex space-x-6">
            {user ? (
              <>
                <Link to="/my-quizzes" className="hover:underline my-auto">
                  My Quizzes
                </Link>
                <Link to="/my-documents" className="hover:underline my-auto">
                  My Documents
                </Link>
                <img
                  src={user.photoURL || defaultUserPhoto}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white mr-4"
                ></img>
                <button
                  className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-700 transition"
                  onClick={logOut}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">
                  Signup/Login
                </Link>
              </>
            )}
          </div>
        </div>
        {/*/ Dropdown menu for small and medium devices  (when isOpen is true)*/}
        {isOpen && user && (
          <div className="lg:hidden flex flex-col mt-2 space-y-2 bg-blue-700 p-4 rounded-md">
            <Link
              to="/my-documents"
              className="hover:underline p-3 border-1 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              My Documents
            </Link>
            <Link
              to="/my-quizzes"
              className="hover:underline p-3 border-1 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              My Quizzes
            </Link>
            <img
              src={user.photoURL || defaultUserPhoto}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-white self-center"
            ></img>
            <button
              className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-700 transition"
              onClick={logOut}
            >
              Logout
            </button>
          </div>
        )}
        {isOpen && !user && (
          <div className="lg:hidden flex flex-col mt-2 space-y-2 bg-blue-700 p-4 rounded-md">
            <Link
              to="/login"
              className="hover:underline p-3 border-1 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Signup/Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
