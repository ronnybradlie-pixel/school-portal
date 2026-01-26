import { useState, useEffect } from "react";
import { db } from "../firebase";
import { addDoc, collection, doc, setDoc, getDocs } from "firebase/firestore";

export default function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [totalFees, setTotalFees] = useState("");
  const [paidFees, setPaidFees] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [activeTab, setActiveTab] = useState("message");

  const clearMessage = () => {
    setTimeout(() => {
      setStatusMessage("");
      setStatusType("");
    }, 3000);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getDocs(collection(db, "messages"));
        setMessagesList(data.docs.map(d => d.data()));
      } catch (e) {
        console.error("Error fetching messages:", e);
      }
    };
    fetchMessages();
  }, []);

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
        [subject.trim().toLowerCase()]: parseInt(score),
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
        <div className={`mb-4 p-4 rounded ${statusType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {statusMessage}
        </div>
      )}

      <div className="flex gap-6">
        <aside className="w-64 bg-slate-800 p-4 rounded shadow border border-slate-700 h-fit">
          <button
            onClick={() => setActiveTab("message")}
            className={`w-full text-left px-4 py-2 rounded mb-2 transition ${
              activeTab === "message"
                ? "bg-green-600 text-white font-semibold"
                : "text-gray-300 hover:bg-slate-700"
            }`}
          >
            Send Message
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`w-full text-left px-4 py-2 rounded mb-2 transition ${
              activeTab === "results"
                ? "bg-blue-600 text-white font-semibold"
                : "text-gray-300 hover:bg-slate-700"
            }`}
          >
            Add Results
          </button>
          <button
            onClick={() => setActiveTab("fees")}
            className={`w-full text-left px-4 py-2 rounded transition ${
              activeTab === "fees"
                ? "bg-purple-600 text-white font-semibold"
                : "text-gray-300 hover:bg-slate-700"
            }`}
          >
            Add Fees
          </button>

          <hr className="my-4 border-slate-700" />
          <h4 className="text-white font-semibold mb-2">Notifications</h4>
          {messagesList.length > 0 ? (
            messagesList.map((m, i) => (
              <p key={i} className="text-gray-300 text-sm border-b border-slate-700 py-1">{m.text}</p>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No messages</p>
          )}
        </aside>

        <main className="flex-1">
          {activeTab === "message" && (
            <div className="bg-slate-800 p-6 rounded shadow border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Send Message</h3>
              <textarea
                className="w-full border border-slate-600 bg-slate-700 text-white p-3 rounded mb-4 placeholder-gray-400"
                placeholder="Send message to parents"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows="6"
              />
              <button
                onClick={sendMessage}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold">
                Send Message
              </button>
            </div>
          )}

          {activeTab === "results" && (
            <div className="bg-slate-800 p-6 rounded shadow border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Add Results</h3>
              <input
                type="text"
                placeholder="Student ID"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                className="w-full border border-slate-600 bg-slate-700 text-white p-3 rounded mb-3 placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Subject (e.g. math)"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full border border-slate-600 bg-slate-700 text-white p-3 rounded mb-3 placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Score"
                value={score}
                onChange={e => setScore(e.target.value)}
                className="w-full border border-slate-600 bg-slate-700 text-white p-3 rounded mb-4 placeholder-gray-400"
              />
              <button
                onClick={addResults}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold">
                Add Results
              </button>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="bg-slate-800 p-6 rounded shadow border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Add Fees</h3>
              <input
                type="text"
                placeholder="Student ID"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                className="w-full border border-slate-600 bg-slate-700 text-white p-3 rounded mb-3 placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Total Fees"
                value={totalFees}
                onChange={e => setTotalFees(e.target.value)}
                className="w-full border border-slate-600 bg-slate-700 text-white p-3 rounded mb-3 placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Paid Amount"
                value={paidFees}
                onChange={e => setPaidFees(e.target.value)}
                className="w-full border border-slate-600 bg-slate-700 text-white p-3 rounded mb-4 placeholder-gray-400"
              />
              <button
                onClick={addFees}
                className="w-full bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 font-semibold">
                Add Fees
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
