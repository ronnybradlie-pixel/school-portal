import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [studentId, setStudentId] = useState("");
  const [math, setMath] = useState("");
  const [english, setEnglish] = useState("");
  const [totalFees, setTotalFees] = useState("");
  const [paidFees, setPaidFees] = useState("");

  const sendMessage = async () => {
    if (!message) return;
    await addDoc(collection(db, "messages"), {
      text: message,
      date: new Date()
    });
    setMessage("");
    alert("Message sent");
  };

  const addResults = async () => {
    if (!studentId || !math || !english) {
      alert("Please fill all fields");
      return;
    }
    await setDoc(doc(db, "results", studentId), {
      math: parseInt(math),
      english: parseInt(english),
      updatedAt: new Date()
    });
    setStudentId("");
    setMath("");
    setEnglish("");
    alert("Results added");
  };

  const addFees = async () => {
    if (!studentId || !totalFees || !paidFees) {
      alert("Please fill all fields");
      return;
    }
    await setDoc(doc(db, "fees", studentId), {
      total: parseInt(totalFees),
      paid: parseInt(paidFees),
      balance: parseInt(totalFees) - parseInt(paidFees),
      updatedAt: new Date()
    });
    setStudentId("");
    setTotalFees("");
    setPaidFees("");
    alert("Fees added");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Messages Section */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">Send Message</h3>
          <textarea
            className="w-full border p-2 rounded mb-4"
            placeholder="Send message to parents"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Send Message
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">Add Results</h3>
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="number"
            placeholder="Math Score"
            value={math}
            onChange={e => setMath(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="number"
            placeholder="English Score"
            value={english}
            onChange={e => setEnglish(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />
          <button
            onClick={addResults}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Results
          </button>
        </div>

        {/* Fees Section */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">Add Fees</h3>
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="number"
            placeholder="Total Fees"
            value={totalFees}
            onChange={e => setTotalFees(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="number"
            placeholder="Paid Amount"
            value={paidFees}
            onChange={e => setPaidFees(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />
          <button
            onClick={addFees}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Add Fees
          </button>
        </div>
      </div>
    </div>
  );
}
