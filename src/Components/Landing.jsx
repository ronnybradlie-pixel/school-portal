import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add email functionality here
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-slate-900">
      {/* Hero Section with Background */}
      <div className="relative h-screen bg-gradient-to-r from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            WELCOME TO <span className="text-blue-400">DREAM INTERNATIONAL</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-4">
            Your Complete Educational Management System
          </p>
          {/* CTA Buttons */}
          <div className="flex gap-6 justify-center flex-wrap">
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              Login Now
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* School Info Section */}
      <section className="py-20 px-4 bg-slate-800 border-t-2 border-blue-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">About Our School</h2>
            <div className="h-1 w-24 bg-blue-400 mx-auto"></div>
            <p className="text-gray-300 text-lg mt-6">Committed to Excellence in Education</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* School Info Text */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">Building Future Leaders</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our school is dedicated to providing world-class education with cutting-edge facilities and experienced educators. We believe in nurturing academic excellence and character development.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                With our innovative digital portal, parents and students can seamlessly track academic progress, manage fees, and stay informed about school announcements in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-slate-800 border-t-2 border-blue-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose Us</h2>
            <div className="h-1 w-24 bg-blue-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* About Content */}
            <div className="space-y-8">
              <div className="bg-slate-900 p-6 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-2xl font-bold text-blue-400 mb-3">Quality Education</h3>
                <p className="text-gray-300 leading-relaxed">
                  We maintain high academic standards with a curriculum designed to develop critical thinking and problem-solving skills essential for success.
                </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-lg border-l-4 border-green-400">
                <h3 className="text-2xl font-bold text-blue-400 mb-3">Expert Educators</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our faculty members are highly qualified professionals with years of experience in their respective fields and dedicated to student success.
                </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-lg border-l-4 border-purple-400">
                <h3 className="text-2xl font-bold text-blue-400 mb-3">Global Perspective</h3>
                <p className="text-gray-300 leading-relaxed">
                  We prepare students for a global world with emphasis on international standards and cross-cultural understanding and collaboration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
 