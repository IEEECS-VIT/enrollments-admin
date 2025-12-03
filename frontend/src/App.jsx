import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Manage from "./pages/questions/manage";
import DashboardPage from "./pages/dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/manage" element={<Manage />} />
    </Routes>
  );
}
