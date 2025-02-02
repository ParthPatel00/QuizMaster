import { useState } from "react";
import { Link } from "react-router-dom";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";

const Navbar = () => {
  // For toggling menu bar
  const [isOpen, setIsOpen] = useState(false);

  // When loggedIn true, user has loggin in, the navbar
  // will look different when logged in, compared to when not
  // logged in.
  // Will implement toggling this feature in the future
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <nav>
      <div className="p-4 bg-blue-600 text-white">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          {/* Logo/Name of the website. Clicking this should route
        user to the home page*/}
          <Link to="/" className="text-2xl font-bold">
            QuizMaster
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
            <Link to="/my-quizzes" className="hover:underline">
              My Quizzes
            </Link>
            <Link to="/my-documents" className="hover:underline">
              My Documents
            </Link>
            <Link to="/signup" className="hover:underline">
              Sign up
            </Link>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </div>
        </div>
        {/*/ Dropdown menu for small and medium devices  (when isOpen is true)*/}
        {isOpen && (
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
            <Link
              to="/signup"
              className="hover:underline p-3 border-1 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="hover:underline p-3 border-1 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
