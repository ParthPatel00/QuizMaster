import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <div className="p-4 bg-blue-600 text-white">
        <Link to="/" className="text-2xl font-bold">
          QuizMaster
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
