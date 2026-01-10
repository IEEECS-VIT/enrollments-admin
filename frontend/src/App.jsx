import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import Login from "./pages/login";
import Manage from "./pages/manage";
import DashboardPage from "./pages/dashboard";
import ResponsePage from "./pages/responses";
import Admin from "./pages/rbac";
import Schedule from "./pages/scheduling";
import Create from "./pages/createSlot";
import Domain from "./pages/domain";
import Sorry from "./pages/sorry";
import Round2 from "./pages/round2";

export default function App() {
  useEffect(() => {
    const logout = () => {
      if (auth.currentUser) {
        signOut(auth);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        logout();
      }
    };

    window.addEventListener("beforeunload", logout);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", logout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/response" element={<ResponsePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/create" element={<Create />} />
      <Route path="/domain" element={<Domain />} />
      <Route path="/manage" element={<Sorry />} />
      <Route path="/round2" element={<Round2 />} />
    </Routes>
  );
}
