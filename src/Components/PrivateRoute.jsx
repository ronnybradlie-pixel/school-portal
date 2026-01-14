import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute(){
const isAuthenticated = true;

  return isAuthenticated ? <Outlet/>: <Navigate to="/" />;
};

export default PrivateRoute;
