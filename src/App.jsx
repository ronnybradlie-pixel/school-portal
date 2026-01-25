import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import AdminDashboard from "./Components/AdminDashboard";
import ParentDashboard from "./Components/ParentDashboard";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard/>}/>
          <Route path="/parent" element={<ParentDashboard/> } />

      </Routes>
  );
}


export default App;
