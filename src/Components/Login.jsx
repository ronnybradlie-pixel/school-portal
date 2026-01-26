import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Hardcoded admin credentials (change these to your desired values)
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    setMessage("");

    if (!email || !password) {
      setMessageType("error");
      setMessage("Please enter email and password");
      return;
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try {
        // Store admin flag in localStorage (no Firestore write needed for hardcoded admin)
        setMessageType("success");
        setMessage("Admin login successful");
        
        localStorage.setItem("adminMode", "true");
        localStorage.setItem("adminUID", "admin_user_001");

        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } catch (error) {
        console.error("Error during admin login:", error);
        setMessageType("error");
        setMessage("Login failed. Please try again.");
      }
    } else {
      setMessageType("error");
      setMessage("Invalid admin credentials");
    }
  };

  const handleParentLogin = async () => {
    setMessage("");

    if (!email || !password) {
      setMessageType("error");
      setMessage("Please enter email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setMessageType("error");
        setMessage("User not found. Please register first.");
        return;
      }

      const role = docSnap.data().role;

      if (role !== "parent") {
        setMessageType("error");
        setMessage("Access denied. Parent login only.");
        return;
      }

      setMessageType("success");
      setMessage("Login successful");

      setTimeout(() => {
        navigate("/parent");
      }, 1000);

    } catch (error) {
      setMessageType("error");
      setMessage("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl shadow-md w-96 border border-slate-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Login</h2>

        {message && (
          <div
            className={`mb-4 p-2 text-center rounded ${
              messageType === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {message}
          </div>
        )}

        <input
          className="w-full p-2 mb-4 border border-slate-600 bg-slate-700 text-white rounded placeholder-gray-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-4 border border-slate-600 bg-slate-700 text-white rounded placeholder-gray-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setIsAdmin(false);
              setMessage("");
            }}
            className={`flex-1 py-2 rounded transition ${
              !isAdmin
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            Parent Login
          </button>
          <button
            onClick={() => {
              setIsAdmin(true);
              setMessage("");
            }}
            className={`flex-1 py-2 rounded transition ${
              isAdmin
                ? "bg-purple-600 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            Admin Login
          </button>
        </div>

        <button
          onClick={isAdmin ? handleAdminLogin : handleParentLogin}
          className={`w-full py-2 rounded text-white font-semibold transition ${
            isAdmin
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isAdmin ? "Login as Admin" : "Login as Parent"}
        </button>

        {!isAdmin && (
          <p className="text-center text-gray-400 text-sm mt-4">
            Don't have an account? <a href="/register" className="text-blue-400 hover:text-blue-300">Register here</a>
          </p>
        )}
      </div>
    </div>
  );
}
