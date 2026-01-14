import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import AdminDashboard from "./Components/AdminDashboard";
import ParentDashboard from "./Components/ParentDashboard";
import PrivateRoute from ".Components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={
          <PrivateRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/parent" element={<ParentDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
