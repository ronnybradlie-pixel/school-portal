import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Hero Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Welcome to <span className="text-blue-400">School Portal</span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Your gateway to academic excellence and seamless communication
          </p>
          <p className="text-lg text-gray-400">
            Manage grades, fees, and stay connected with your school community
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-white font-semibold mb-2">Track Grades</h3>
            <p className="text-gray-400 text-sm">View your academic performance and subject scores</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-white font-semibold mb-2">Manage Fees</h3>
            <p className="text-gray-400 text-sm">Monitor fee payments and outstanding balances</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-white font-semibold mb-2">Stay Connected</h3>
            <p className="text-gray-400 text-sm">Receive important notifications and announcements</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition duration-300 border border-slate-600"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
