import { useEffect, useState } from "react";

export default function ParentDashboard() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getDocs(collection(db, "messages"));
      setMessages(data.docs.map(doc => doc.data()));
    };
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Parent / Student Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Messages</h3>
          {messages.map((msg, i) => (
            <p key={i} className="border-b py-1">{msg.text}</p>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Results</h3>
          <p>Math: 80%</p>
          <p>English: 75%</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Fees</h3>
          <p>Total: KES 30,000</p>
          <p className="text-red-600">Balance: KES 10,000</p>
        </div>
      </div>
    </div>
  );
}
