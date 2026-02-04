import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // Renamed from email to be generic
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    setMessage("");
    if (!identifier || !password) {
      setMessageType("error");
      setMessage("Please enter email and password");
      return;
    }

    if (identifier === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setMessageType("success");
      setMessage("Admin login successful");
      localStorage.setItem("adminMode", "true");
      localStorage.setItem("adminUID", "admin_user_001");
      setTimeout(() => navigate("/admin"), 1000);
    } else {
      setMessageType("error");
      setMessage("Invalid admin credentials");
    }
  };

  const handleParentLogin = async () => {
    setMessage("");

    if (!identifier || !password) {
      setMessageType("error");
      setMessage("Please enter Student ID and password");
      return;
    }

    try {
      let loginEmail = identifier;

      // 1. Check if input is an ID (no @ symbol)
      if (!identifier.includes("@")) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("studentId", "==", identifier));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setMessageType("error");
          setMessage("Student ID not found. Please check and try again.");
          return;
        }

        // Get the email linked to this ID from Firestore
        const userData = querySnapshot.docs[0].data();
        loginEmail = userData.email;
        
        // Save the Student ID for the dashboard to use later
        localStorage.setItem("currentStudentId", identifier);
      }

      // 2. Perform Firebase Auth with the resolved email
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        password
      );

      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role !== "parent") {
          setMessageType("error");
          setMessage("Access denied. Parent login only.");
          return;
        }

        setMessageType("success");
        setMessage("Login successful");
        localStorage.setItem("userUID", user.uid);

        setTimeout(() => navigate("/parent"), 1000);
      } else {
        setMessageType("error");
        setMessage("User profile record not found.");
      }

    } catch (error) {
      console.error("Login error:", error);
      setMessageType("error");
      setMessage("Invalid ID/Email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl shadow-md w-96 border border-slate-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Login</h2>

        {message && (
          <div className={`mb-4 p-2 text-center rounded ${
            messageType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>
            {message}
          </div>
        )}

        <input
          className="w-full p-2 mb-4 border border-slate-600 bg-slate-700 text-white rounded placeholder-gray-400"
          placeholder={isAdmin ? "Admin Email" : "Student ID or Email"}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
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
            onClick={() => { setIsAdmin(false); setMessage(""); }}
            className={`flex-1 py-2 rounded transition ${
              !isAdmin ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            Parent Login
          </button>
          <button
            onClick={() => { setIsAdmin(true); setMessage(""); }}
            className={`flex-1 py-2 rounded transition ${
              isAdmin ? "bg-purple-600 text-white" : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            Admin Login
          </button>
        </div>

        <button
          onClick={isAdmin ? handleAdminLogin : handleParentLogin}
          className={`w-full py-2 rounded text-white font-semibold transition ${
            isAdmin ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
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