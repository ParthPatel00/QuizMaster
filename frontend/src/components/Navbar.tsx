import { useState } from "react";
import { Link } from "react-router-dom";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";

const Navbar = () => {
  // For toggling menu bar
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav>
      <div className="p-4 bg-blue-600 text-white">
        {/* Logo/Name of the website. Clicking this should route
        user to the home page*/}
        <Link to="/" className="text-2xl font-bold">
          QuizMaster
        </Link>
        {/* Menu button for mobile */}
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-800" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-800" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
