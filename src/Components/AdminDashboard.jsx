import { useState } from "react";

export default function AdminDashboard() {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message) return;
    await addDoc(collection(db, "messages"), {
      text: message,
      date: new Date()
    });
    setMessage("");
    alert("Message sent");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="bg-white p-4 rounded shadow">
        <textarea
          className="w-full border p-2 rounded mb-4"
          placeholder="Send message to parents"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
