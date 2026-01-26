import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import AdminDashboard from "./Components/AdminDashboard";
import ParentDashboard from "./Components/ParentDashboard";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>}/>
        <Route path="/parent" element={<PrivateRoute><ParentDashboard /></PrivateRoute>}/>
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
  );
}

export default App;
