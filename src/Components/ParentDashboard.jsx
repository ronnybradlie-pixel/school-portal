import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function ParentDashboard() {
  const [messages, setMessages] = useState([]);
  const [results, setResults] = useState(null);
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notifications");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user ID
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        // Fetch messages
        const msgData = await getDocs(collection(db, "messages"));
        setMessages(msgData.docs.map(doc => doc.data()));

        // Fetch results for current user
        const resultsDoc = await getDoc(doc(db, "results", userId));
        if (resultsDoc.exists()) {
          setResults(resultsDoc.data());
        }

        // Fetch fees for current user
        const feesDoc = await getDoc(doc(db, "fees", userId));
        if (feesDoc.exists()) {
          setFees(feesDoc.data());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Parent / Student Dashboard</h2>

      <div className="flex gap-6">
        <aside className="w-64 bg-white-800 p-4 rounded shadow border border-slate-700 h-fit">
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full text-left px-4 py-2 rounded mb-2 transition ${
              activeTab === "notifications"
                ? "bg-blue-600 text-white font-semibold"
                : "text-gray-300 hover:bg-slate-700"
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`w-full text-left px-4 py-2 rounded mb-2 transition ${
              activeTab === "results"
                ? "bg-blue-600 text-white font-semibold"
                : "text-gray-300 hover:bg-slate-700"
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab("fees")}
            className={`w-full text-left px-4 py-2 rounded transition ${
              activeTab === "fees"
                ? "bg-blue-600 text-white font-semibold"
                : "text-gray-300 hover:bg-slate-700"
            }`}
          >
            Fees
          </button>
        </aside>

        <main className="flex-1">
          {activeTab === "notifications" && (
            <div className="bg-slate-800 p-6 rounded shadow border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Notifications</h3>
              {messages.length > 0 ? (
                messages.map((msg, i) => (
                  <p key={i} className="text-gray-200 border-b border-slate-700 py-3">{msg.text}</p>
                ))
              ) : (
                <p className="text-gray-400">No notifications</p>
              )}
            </div>
          )}

          {activeTab === "results" && (
            <div className="bg-slate-800 p-6 rounded shadow border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Results</h3>
              {results ? (
                Object.entries(results).map(([key, value]) => 
                  key !== "updatedAt" && (
                    <p key={key} className="text-gray-200 py-2 text-lg">
                      {key.charAt(0).toUpperCase() + key.slice(1)}: <span className="font-semibold text-green-400">{value}%</span>
                    </p>
                  )
                )
              ) : (
                <p className="text-gray-400">No results available</p>
              )}
            </div>
          )}

          {activeTab === "fees" && (
            <div className="bg-slate-800 p-6 rounded shadow border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Fees</h3>
              {fees ? (
                <div className="space-y-2">
                  <p className="text-gray-200">Total: <span className="font-semibold">KES {fees.total}</span></p>
                  <p className="text-gray-200">Paid: <span className="font-semibold text-green-400">KES {fees.paid}</span></p>
                  <p className="text-gray-200">Balance: <span className="font-semibold text-red-400">KES {fees.balance}</span></p>
                </div>
              ) : (
                <p className="text-gray-400">No fee information</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
