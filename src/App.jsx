import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "./axios/Axios";

import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Service from "./pages/services/Services";
import Contact from "./pages/contact/Contact";
import AdminUsers from "./pages/admin/Admin";

import ProtectedRoute from "./pages/ProtectedRoute";
import AdminRoute from "./pages/AdminRoute";

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // ✅ ONLY verify user (NO navigation here)
  const verifyUser = async () => {
    try {
      const res = await Axios.get("/user/verify");

      if (res.data.status) {
        setUser(res.data.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (er) {
      console.log(er)
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const logout = async () => {
    try {
      await Axios.post("/user/logout");
    } catch (error) {
      console.log(error);
    }

    setUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        isAdmin={user?.role === "admin"}
        onLogout={logout}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={<Login onLogin={verifyUser} />}
        />
        <Route
          path="/signup"
          element={<Signup onLogin={verifyUser} />}
        />

        {/* Protected User Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <About />
            </ProtectedRoute>
          }
        />

        <Route
          path="/service"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Service />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Contact />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Route */}
        <Route
          path="/admin/users"
          element={
            <AdminRoute isLoggedIn={isLoggedIn} user={user}>
              <AdminUsers />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;