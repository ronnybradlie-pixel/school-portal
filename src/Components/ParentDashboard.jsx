import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase";

export default function ParentDashboard() {
  const [student, setStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [results, setResults] = useState(null);
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notifications");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Matches the key we set in the Login component
        const storedId = localStorage.getItem("currentStudentId");
        
        if (!storedId) {
          setLoading(false);
          return;
        }

        // 1. Fetch Student Profile
        const studentQuery = query(
          collection(db, "students"),
          where("studentId", "==", storedId)
        );
        const studentSnap = await getDocs(studentQuery);

        if (!studentSnap.empty) {
          const studentData = studentSnap.docs[0].data();
          setStudent(studentData);

          // 2. Fetch Notifications/Messages
          const msgQuery = query(
            collection(db, "messages"),
            where("studentId", "==", storedId)
          );
          const msgSnap = await getDocs(msgQuery);
          setMessages(msgSnap.docs.map(d => d.data()));

          // 3. Fetch Results
          const resultsQuery = query(
            collection(db, "results"),
            where("studentId", "==", storedId)
          );
          const resultsSnap = await getDocs(resultsQuery);
          if (!resultsSnap.empty) {
            setResults(resultsSnap.docs[0].data());
          }

          // 4. Fetch Fees
          const feesQuery = query(
            collection(db, "fees"),
            where("studentId", "==", storedId)
          );
          const feesSnap = await getDocs(feesQuery);
          if (!feesSnap.empty) {
            setFees(feesSnap.docs[0].data());
          }
        } else {
          console.warn("No student found in Firestore with ID:", storedId);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center p-6 text-white text-xl animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center bg-slate-800 p-10 rounded-xl border border-red-500/50 shadow-lg">
          <p className="text-red-400 text-lg font-semibold">
            Student not found.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Please ensure the Admin has registered your ID correctly.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="mt-4 text-blue-400 underline text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      {/* Header Section */}
      <div className="mb-8 border-b border-slate-700 pb-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white">{student.name}</h2>
            <p className="text-blue-400 font-medium">Class: {student.class}</p>
            <p className="text-sm text-gray-500 mt-1">
              Internal ID: {student.studentId}
            </p>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            className="bg-red-500/10 text-red-500 border border-red-500/50 px-4 py-1 rounded hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-slate-800 p-4 rounded-xl shadow-md border border-slate-700 h-fit">
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all ${
              activeTab === "notifications"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            Notifications
          </button>

          <button
            onClick={() => setActiveTab("results")}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all ${
              activeTab === "results"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            Exam Results
          </button>

          <button
            onClick={() => setActiveTab("fees")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              activeTab === "fees"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            Fee Statements
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {activeTab === "notifications" && (
            <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700 animate-fadeIn">
              <h3 className="text-xl font-semibold mb-4 border-b border-slate-700 pb-2">
                Latest Notifications
              </h3>
              {messages.length > 0 ? (
                messages.map((msg, i) => (
                  <div key={i} className="group border-b border-slate-700/50 py-4 last:border-0">
                    <p className="text-gray-200 leading-relaxed">{msg.text}</p>
                    {msg.date && <span className="text-xs text-gray-500">{msg.date}</span>}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No new messages from the school.</p>
              )}
            </div>
          )}

          {activeTab === "results" && (
            <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700 animate-fadeIn">
              <h3 className="text-xl font-semibold mb-6 border-b border-slate-700 pb-2">Academic Performance</h3>
              {results ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(results).map(
                    ([key, value]) =>
                      key !== "updatedAt" && key !== "studentId" && (
                        <div key={key} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
                          <span className="text-gray-400 uppercase text-sm tracking-wider">{key}</span>
                          <span className="text-2xl font-bold text-green-400">{value}%</span>
                        </div>
                      )
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No results have been uploaded for this student yet.</p>
              )}
            </div>
          )}

          {activeTab === "fees" && (
            <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700 animate-fadeIn">
              <h3 className="text-xl font-semibold mb-6 border-b border-slate-700 pb-2">Fee Balance</h3>
              {fees ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                    <span className="text-gray-400">Total Term Invoice</span>
                    <span className="text-xl font-mono">KES {fees.total}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                    <span className="text-gray-400">Total Amount Paid</span>
                    <span className="text-xl font-mono text-green-400">KES {fees.paid}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <span className="text-blue-300 font-bold">Outstanding Balance</span>
                    <span className="text-2xl font-mono text-red-400 font-bold">KES {fees.balance}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No fee records found.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}