import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth, db } from "../firebase";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

function PrivateRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Determine required role based on route
  const requiredRole = location.pathname.includes("/admin") ? "admin" : "parent";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // Check if this is admin mode (from localStorage)
      const isAdminMode = localStorage.getItem("adminMode") === "true";
      const adminUID = localStorage.getItem("adminUID");

      if (isAdminMode && adminUID && requiredRole === "admin") {
        // Allow admin to access admin routes
        setIsAuthenticated(true);
        setUserRole("admin");
        setLoading(false);
        return;
      }

      if (!user) {
        setIsAuthenticated(false);
        setUserRole(null);
        setLoading(false);
        return;
      }

      // For parent routes, check Firestore role
      if (requiredRole === "parent") {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const role = docSnap.data().role;
            setUserRole(role);
            setIsAuthenticated(role === "parent");
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsAuthenticated(false);
        }
      } else {
        // Admin route but no admin mode
        setIsAuthenticated(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [requiredRole]);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default PrivateRoute;