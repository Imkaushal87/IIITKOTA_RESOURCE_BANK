import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="text-lg font-bold">Logo</div>
      <div className="space-x-6">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <Link to="/about" className="hover:text-blue-500">About</Link>
        <Link to="/user" className="hover:text-blue-500">User</Link>
        <Link to="/upload" className="hover:text-blue-500">Upload</Link>
      </div>
    </nav>
  );
};

export default Navbar;
