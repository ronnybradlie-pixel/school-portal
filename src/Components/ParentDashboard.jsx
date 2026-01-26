import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function ParentDashboard() {
  const [messages, setMessages] = useState([]);
  const [results, setResults] = useState(null);
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);

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

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Notifications</h3>
          {messages.length > 0 ? (
            messages.map((msg, i) => (
              <p key={i} className="border-b py-1">{msg.text}</p>
            ))
          ) : (
            <p className="text-gray-500">No Notifications</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Results</h3>
          {results ? (
            Object.entries(results).map(([key, value]) => 
              key !== "updatedAt" && <p key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}%</p>
            )
          ) : (
            <p className="text-gray-500">No results available</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Fees</h3>
          {fees ? (
            <>
              <p>Total: KES {fees.total}</p>
              <p>Paid: KES {fees.paid}</p>
              <p className="text-red-600">Balance: KES {fees.balance}</p>
            </>
          ) : (
            <p className="text-gray-500">No fee information</p>
          )}
        </div>
      </div>
    </div>
  );
}
