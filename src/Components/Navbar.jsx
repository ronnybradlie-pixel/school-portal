import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setUserRole(null);
        return;
      }

      setUser(u);

      // Fetch user role from Firestore
      try {
        const docRef = doc(db, "users", u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      // Clear admin mode if logged in as admin
      localStorage.removeItem("adminMode");
      localStorage.removeItem("adminUID");
      
      // Sign out from Firebase if user exists
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
          {/* Show parent dashboard link only for parents */}
          {user && userRole === "parent" && (
            <li>
              <Link to="/parent" className="hover:text-blue-200 transition">
                Dashboard
              </Link>
            </li>
          )}

          {/* Show admin dashboard link only for admins */}
          {user && userRole === "admin" && (
            <li>
              <Link to="/admin" className="hover:text-blue-200 transition">
                Admin Dashboard
              </Link>
            </li>
          )}

          {user ? (
            <>
              <li>
                <span className="text-sm text-blue-100">{user.email}</span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-200 transition">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
