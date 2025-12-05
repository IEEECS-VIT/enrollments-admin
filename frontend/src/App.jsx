import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Manage from "./pages/manage";
import DashboardPage from "./pages/dashboard";
import ResponsePage from "./pages/responses"
import Admin from "./pages/rbac";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/response" element={<ResponsePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/manage" element={<Manage />} />
    </Routes>
  );
}
