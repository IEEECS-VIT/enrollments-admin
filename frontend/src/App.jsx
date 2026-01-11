import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
  const navigate = useNavigate();

  const ACTIVITY_LIMIT = 20 * 60 * 1000;
  const LAST_ACTIVE_KEY = "lastActiveTime";

  const updateLastActive = () => {
    localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem(LAST_ACTIVE_KEY);
    navigate("/");
  };

  const checkInactivity = async () => {
    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    if (!lastActive) return;

    if (Date.now() - Number(lastActive) >= ACTIVITY_LIMIT) {
      await handleLogout();
      alert("You were logged out due to inactivity.");
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
        if (
          lastActive &&
          Date.now() - Number(lastActive) >= ACTIVITY_LIMIT
        ) {
          await handleLogout();
          return;
        }
        updateLastActive();
      } else {
        localStorage.removeItem(LAST_ACTIVE_KEY);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, updateLastActive));

    const interval = setInterval(checkInactivity, 60000);

    return () => {
      events.forEach((e) =>
        window.removeEventListener(e, updateLastActive)
      );
      clearInterval(interval);
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
