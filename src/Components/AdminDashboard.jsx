import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [totalFees, setTotalFees] = useState("");
  const [paidFees, setPaidFees] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const clearMessage = () => {
    setTimeout(() => {
      setStatusMessage("");
      setStatusType("");
    }, 3000);
  };

  const sendMessage = async () => {
    if (!message) {
      setStatusMessage("Please enter a message");
      setStatusType("error");
      clearMessage();
      return;
    }
    try {
      await addDoc(collection(db, "messages"), {
        text: message,
        date: new Date()
      });
      setMessage("");
      setStatusMessage("Message sent successfully!");
      setStatusType("success");
      clearMessage();
    } catch (error) {
      setStatusMessage("Error sending message: " + error.message);
      setStatusType("error");
      clearMessage();
    }
  };

  const addResults = async () => {
    if (!studentId || !subject || !score) {
      setStatusMessage("Please fill all fields");
      setStatusType("error");
      clearMessage();
      return;
    }
    try {
      await setDoc(doc(db, "results", studentId), {
        [subject]: parseInt(score),
        updatedAt: new Date()
      }, { merge: true });
      setStudentId("");
      setSubject("");
      setScore("");
      setStatusMessage("Results added successfully!");
      setStatusType("success");
      clearMessage();
    } catch (error) {
      setStatusMessage("Error adding results: " + error.message);
      setStatusType("error");
      clearMessage();
    }
  };

  const addFees = async () => {
    if (!studentId || !totalFees || !paidFees) {
      setStatusMessage("Please fill all fields");
      setStatusType("error");
      clearMessage();
      return;
    }
    try {
      await setDoc(doc(db, "fees", studentId), {
        total: parseInt(totalFees),
        paid: parseInt(paidFees),
        balance: parseInt(totalFees) - parseInt(paidFees),
        updatedAt: new Date()
      });
      setStudentId("");
      setTotalFees("");
      setPaidFees("");
      setStatusMessage("Fees added successfully!");
      setStatusType("success");
      clearMessage();
    } catch (error) {
      setStatusMessage("Error adding fees: " + error.message);
      setStatusType("error");
      clearMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Admin Dashboard</h2>

      {statusMessage && (
        <div className={`mb-4 p-4 rounded ${statusType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {statusMessage}
        </div>
      )}

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
            type="text"
            placeholder="Subject (e.g. Math, English, Science)"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="number"
            placeholder="Score"
            value={score}
            onChange={e => setScore(e.target.value)}
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
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Fees
          </button>
        </div>
      </div>
    </div>
  );
}
