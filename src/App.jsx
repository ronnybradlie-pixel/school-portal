import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./Components/Landing";
import Login from "./Components/Login";
import Register from "./Components/Register";
import AdminDashboard from "./Components/AdminDashboard";
import ParentDashboard from "./Components/ParentDashboard";
import PrivateRoute from "./Components/PrivateRoute";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/parent" element={<ParentDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
      </BrowserRouter>
  );
}

export default App;
