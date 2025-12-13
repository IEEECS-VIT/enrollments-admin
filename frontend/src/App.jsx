import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Manage from "./pages/manage";
import DashboardPage from "./pages/dashboard";
import ResponsePage from "./pages/responses"
import Admin from "./pages/rbac";
import Schedule from "./pages/scheduling";
import Test from "./pages/card";
import Create from "./pages/createSlot";
import View from "./pages/viewSlots"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/response" element={<ResponsePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/schedule" element={<Schedule />} />
       <Route path="/create" element={<Create/>} />
      <Route path="/manage" element={<Manage />} />
    </Routes>
  );
}
