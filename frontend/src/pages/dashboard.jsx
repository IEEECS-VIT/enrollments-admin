import { useNavigate } from "react-router-dom";
import { FiUsers, FiEdit, FiList, FiCalendar, FiPlus, FiGrid } from "react-icons/fi";
import ieeeLogo from "/logo.png";

export default function ResponsesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black p-10 flex justify-center items-center">
      <div className="bg-white/10 p-10 rounded-3xl w-full max-w-4xl border border-yellow-500/20">

        <div className="flex justify-center mb-6">
          <img
            src={ieeeLogo}
            alt="IEEE Computer Society Logo"
            className="h-14 md:h-20 w-auto"
          />
        </div>

        <h1 className="text-4xl font-bold text-white mb-6 text-center tracking-wide">
          Dashboard
        </h1>

        <div className="flex justify-center mb-12">
          <button
            onClick={() => navigate("/domains")}
            className="group bg-black/50 border border-yellow-500/40 transition-all shadow-xl rounded-2xl px-10 py-4 flex items-center gap-3 transform hover:-translate-y-1"
          >
            <span className="text-yellow-300 text-2xl group-hover:scale-110 transition">
              <FiGrid />
            </span>
            <span className="text-lg font-semibold text-white">
              View Domain Selection
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <button
            onClick={() => navigate("/admin")}
            className="group bg-black/40 border border-yellow-500/30 transition-all shadow-xl rounded-3xl p-8 w-full text-center cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex justify-center mb-3 text-yellow-300 text-4xl group-hover:scale-110 transition">
              <FiUsers />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Roles
            </h2>
          </button>

          <button
            onClick={() => navigate("/manage")}
            className="group bg-black/40 border border-yellow-500/30 transition-all rounded-3xl p-8 w-full text-center cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex justify-center mb-3 text-yellow-300 text-4xl group-hover:scale-110 transition">
              <FiEdit />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Manage Questions
            </h2>
          </button>

          <button
            onClick={() => navigate("/response")}
            className="group bg-black/40 border border-yellow-500/30 transition-all shadow-xl rounded-3xl p-8 w-full text-center cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex justify-center mb-3 text-yellow-300 text-4xl group-hover:scale-110 transition">
              <FiList />
            </div>
            <h2 className="text-xl font-semibold text-white">
              View Responses
            </h2>
          </button>

          <button
            onClick={() => navigate("/schedule")}
            className="group bg-black/40 border border-yellow-500/30 transition-all shadow-xl rounded-3xl p-8 w-full text-center cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex justify-center mb-3 text-yellow-300 text-4xl group-hover:scale-110 transition">
              <FiCalendar />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Interview Scheduling
            </h2>
          </button>

          <button
            onClick={() => navigate("/create")}
            className="group bg-black/40 border border-yellow-500/30 transition-all shadow-xl rounded-3xl p-8 w-full text-center cursor-pointer transform hover:-translate-y-1 sm:col-span-2"
          >
            <div className="flex justify-center mb-3 text-yellow-300 text-4xl group-hover:scale-110 transition">
              <FiPlus />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Create Slot
            </h2>
          </button>
        </div>
      </div>
    </div>
  );
}
