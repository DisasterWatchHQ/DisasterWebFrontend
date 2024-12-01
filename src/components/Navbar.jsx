import { Link } from "react-router-dom";
import { FaBell, FaUser, FaHome } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between">
      <Link to="/" className="flex items-center">
        <FaHome className="mr-2" /> Home
      </Link>
      <div className="flex space-x-4">
        <Link to="/alerts" className="flex items-center">
          <FaBell className="mr-2" /> Alerts
        </Link>
        <Link to="/login" className="flex items-center">
          <FaUser className="mr-2" /> Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
