import { useState } from "react";
import { Link } from "react-router-dom";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";

const Navbar = () => {
  // For toggling menu bar
  const [isOpen, setIsOpen] = useState(false);
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
