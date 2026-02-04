import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit
} from "firebase/firestore";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("students");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  
  // FORM STATES
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [studentEmail, setStudentEmail] = useState(""); // NEW: Required for Login logic
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [totalFees, setTotalFees] = useState("");
  const [paidFees, setPaidFees] = useState("");
  const [message, setMessage] = useState("");

  const clearMessage = () => {
    setTimeout(() => {
      setStatusMessage("");
      setStatusType("");
    }, 4000);
  };

  // Helper to generate a unique ID
  const generateStudentId = async () => {
    const year = new Date().getFullYear();
    const snap = await getDocs(collection(db, "students"));
    const count = snap.size + 1;
    return `STU-${year}-${String(count).padStart(4, "0")}`;
  };

  const createStudent = async () => {
    // UPDATED: Now checks for email too
    if (!studentName || !studentClass || !studentEmail) {
      setStatusMessage("Fill all student details including Email");
      setStatusType("error");
      clearMessage();
      return;
    }

    try {
      const newStudentId = await generateStudentId();

      // 1. Save to 'students' collection for the Dashboard to read
      await setDoc(doc(db, "students", newStudentId), {
        studentId: newStudentId,
        name: studentName,
        class: studentClass,
        email: studentEmail.toLowerCase(), // Save email here
        createdAt: new Date(),
      });

      // 2. IMPORTANT: Save to 'users' collection so the Login can find the email via ID
      await setDoc(doc(db, "users", newStudentId), {
        studentId: newStudentId,
        email: studentEmail.toLowerCase(),
        role: "parent"
      });

      setStatusMessage(`Created! ID: ${newStudentId}. Password will be whatever is set in Firebase Auth.`);
      setStatusType("success");
      
      setStudentId(newStudentId);
      setStudentName("");
      setStudentClass("");
      setStudentEmail("");
      clearMessage();
    } catch (err) {
      setStatusMessage(err.message);
      setStatusType("error");
      clearMessage();
    }
  };

  // ... (sendMessage, addResults, addFees functions remain the same as your snippet)
  const sendMessage = async () => {
    if (!studentId || !message) { setStatusMessage("ID & message required"); setStatusType("error"); clearMessage(); return; }
    await addDoc(collection(db, "messages"), { studentId, text: message, date: new Date().toLocaleDateString() });
    setMessage(""); setStatusMessage("Message sent"); setStatusType("success"); clearMessage();
  };

  const addResults = async () => {
    if (!studentId || !subject || !score) { setStatusMessage("Fill all fields"); setStatusType("error"); clearMessage(); return; }
    await setDoc(doc(db, "results", studentId), { [subject.toLowerCase()]: parseInt(score), studentId, updatedAt: new Date() }, { merge: true });
    setSubject(""); setScore(""); setStatusMessage("Results added"); setStatusType("success"); clearMessage();
  };

  const addFees = async () => {
    if (!studentId || !totalFees || !paidFees) { setStatusMessage("Fill all fields"); setStatusType("error"); clearMessage(); return; }
    await setDoc(doc(db, "fees", studentId), { total: parseInt(totalFees), paid: parseInt(paidFees), balance: parseInt(totalFees) - parseInt(paidFees), studentId, updatedAt: new Date() });
    setTotalFees(""); setPaidFees(""); setStatusMessage("Fees updated"); setStatusType("success"); clearMessage();
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
        <h2 className="text-3xl font-bold text-blue-400">Dream International Admin</h2>
        <button onClick={() => window.location.href = "/"} className="text-gray-400 hover:text-white">Logout</button>
      </div>

      {statusMessage && (
        <div className={`mb-6 p-4 rounded-lg shadow-lg animate-bounce ${statusType === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {statusMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 bg-slate-800 p-4 rounded-xl border border-slate-700 h-fit">
          {["students", "message", "results", "fees"].map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 capitalize transition-all ${
                activeTab === key ? "bg-blue-600 shadow-lg scale-105" : "hover:bg-slate-700 text-gray-400"
              }`}
            >
              {key.replace("students", "Add Student").replace("message", "Send Notification")}
            </button>
          ))}
        </aside>

        <main className="flex-1 bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
          {activeTab === "students" && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">Register New Student</h3>
              <input placeholder="Full Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500" />
              <input placeholder="Class (e.g. Grade 5)" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500" />
              <input placeholder="Parent/Student Email (used for login)" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500" />
              <button onClick={createStudent} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition">Generate ID & Save</button>
            </div>
          )}

          {activeTab !== "students" && (
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-1 block">Target Student ID</label>
              <input placeholder="e.g. STU-2026-0001" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full p-3 bg-slate-900 rounded-lg border border-slate-700 text-blue-400 font-mono" />
            </div>
          )}

          {activeTab === "message" && (
            <div className="space-y-4">
              <textarea rows="4" placeholder="Type notification message here..." value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600" />
              <button onClick={sendMessage} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold transition">Send Message</button>
            </div>
          )}

          {activeTab === "results" && (
            <div className="space-y-4">
              <input placeholder="Subject (e.g. Mathematics)" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-3 bg-slate-700 rounded-lg" />
              <input type="number" placeholder="Score (%)" value={score} onChange={(e) => setScore(e.target.value)} className="w-full p-3 bg-slate-700 rounded-lg" />
              <button onClick={addResults} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold">Update Record</button>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="space-y-4">
              <input type="number" placeholder="Total Term Fees" value={totalFees} onChange={(e) => setTotalFees(e.target.value)} className="w-full p-3 bg-slate-700 rounded-lg" />
              <input type="number" placeholder="Amount Paid" value={paidFees} onChange={(e) => setPaidFees(e.target.value)} className="w-full p-3 bg-slate-700 rounded-lg" />
              <button onClick={addFees} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold">Update Finance</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}