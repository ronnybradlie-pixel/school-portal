import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">DREAM INTERNATIONAL</h1>
        
        <ul className="flex gap-6 items-center">
          <li>
            <a href="/parent" className="hover:text-blue-200 transition">
              Students
            </a>
          </li>
          <li>
            <a href="/admin" className="hover:text-blue-200 transition">
              Admin
            </a>
          </li>
          <li>
            <span className="text-sm text-blue-100">
              {user?.email || "Guest"}
            </span>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
