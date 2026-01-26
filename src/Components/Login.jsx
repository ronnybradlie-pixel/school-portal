import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage("");

    if (!email || !password) {
      setMessageType("error")
      setMessage("Please enter email and password")
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
        setMessage("No role assigned to this user");
        return;
      }

      const role = docSnap.data().role;

      setMessageType("success");
      setMessage("Login successful");

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/parent");
        }
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

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}
