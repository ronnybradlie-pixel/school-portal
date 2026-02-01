import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDocs,
} from "firebase/firestore";

export default function AdminDashboard() {
  // GENERAL STATES
  const [activeTab, setActiveTab] = useState("students");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
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
    }, 3000);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const snap = await getDocs(collection(db, "messages"));
      setMessagesList(snap.docs.map((d) => d.data()));
    };
    fetchMessages();
  }, []);

  const generateStudentId = async () => {
    const year = new Date().getFullYear();
    const snap = await getDocs(collection(db, "students"));
    const count = snap.size + 1;
    return `STU-${year}-${String(count).padStart(4, "0")}`;
  };

  const createStudent = async () => {
    if (!studentName || !studentClass) {
      setStatusMessage("Fill all student details");
      setStatusType("error");
      clearMessage();
      return;
    }

    try {
      const newStudentId = await generateStudentId();

      await setDoc(doc(db, "students", newStudentId), {
        studentId: newStudentId,
        name: studentName,
        class: studentClass,
        createdAt: new Date(),
      });

      setStudentId(newStudentId);
      setStudentName("");
      setStudentClass("");

      setStatusMessage(`Student created. ID: ${newStudentId}`);
      setStatusType("success");
      clearMessage();
    } catch (err) {
      setStatusMessage(err.message);
      setStatusType("error");
      clearMessage();
    }
  };

  const sendMessage = async () => {
    if (!studentId || !message) {
      setStatusMessage("Student ID & message required");
      setStatusType("error");
      clearMessage();
      return;
    }

    await addDoc(collection(db, "messages"), {
      studentId,
      text: message,
      date: new Date(),
    });

    setMessage("");
    setStatusMessage("Message sent");
    setStatusType("success");
    clearMessage();
  };

  const addResults = async () => {
    if (!studentId || !subject || !score) {
      setStatusMessage("Fill all fields");
      setStatusType("error");
      clearMessage();
      return;
    }

    await setDoc(
      doc(db, "results", studentId),
      {
        [subject.toLowerCase()]: parseInt(score),
        updatedAt: new Date(),
      },
      { merge: true }
    );

    setSubject("");
    setScore("");

    setStatusMessage("Results added");
    setStatusType("success");
    clearMessage();
  };

  const addFees = async () => {
    if (!studentId || !totalFees || !paidFees) {
      setStatusMessage("Fill all fields");
      setStatusType("error");
      clearMessage();
      return;
    }

    await setDoc(doc(db, "fees", studentId), {
      total: parseInt(totalFees),
      paid: parseInt(paidFees),
      balance: parseInt(totalFees) - parseInt(paidFees),
      updatedAt: new Date(),
    });

    setTotalFees("");
    setPaidFees("");

    setStatusMessage("Fees updated");
    setStatusType("success");
    clearMessage();
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {statusMessage && (
        <div
          className={`mb-4 p-4 rounded ${
            statusType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <div className="flex gap-6">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-800 p-4 rounded border border-slate-700">
          {[
            ["students", "Create Student"],
            ["message", "Send Message"],
            ["results", "Add Results"],
            ["fees", "Add Fees"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full text-left px-4 py-2 rounded mb-2 ${
                activeTab === key
                  ? "bg-blue-600 font-semibold"
                  : "hover:bg-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </aside>

        {/* MAIN */}
        <main className="flex-1 bg-slate-800 p-6 rounded border border-slate-700">
          {activeTab === "students" && (
            <>
              <input
                placeholder="Student Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full mb-3 p-3 bg-slate-700 rounded"
              />
              <input
                placeholder="Class"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full mb-4 p-3 bg-slate-700 rounded"
              />
              <button
                onClick={createStudent}
                className="bg-purple-600 px-6 py-2 rounded"
              >
                Create Student
              </button>
            </>
          )}

          {activeTab !== "students" && (
            <input
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full mb-4 p-3 bg-slate-700 rounded"
            />
          )}

          {activeTab === "message" && (
            <>
              <textarea
                rows="5"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full mb-4 p-3 bg-slate-700 rounded"
              />
              <button onClick={sendMessage} className="bg-green-600 px-6 py-2 rounded">
                Send Message
              </button>
            </>
          )}

          {activeTab === "results" && (
            <>
              <input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mb-3 p-3 bg-slate-700 rounded"
              />
              <input
                type="number"
                placeholder="Score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full mb-4 p-3 bg-slate-700 rounded"
              />
              <button onClick={addResults} className="bg-blue-600 px-6 py-2 rounded">
                Add Results
              </button>
            </>
          )}

          {activeTab === "fees" && (
            <>
              <input
                type="number"
                placeholder="Total Fees"
                value={totalFees}
                onChange={(e) => setTotalFees(e.target.value)}
                className="w-full mb-3 p-3 bg-slate-700 rounded"
              />
              <input
                type="number"
                placeholder="Paid Fees"
                value={paidFees}
                onChange={(e) => setPaidFees(e.target.value)}
                className="w-full mb-4 p-3 bg-slate-700 rounded"
              />
              <button onClick={addFees} className="bg-blue-600 px-6 py-2 rounded">
                Add Fees
              </button>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
