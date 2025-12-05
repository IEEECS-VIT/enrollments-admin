import { useNavigate } from "react-router-dom";
import { FiUsers, FiEdit, FiList, FiCalendar } from "react-icons/fi";

export default function ResponsesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black to-neutral-900 p-10 flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-4xl border border-white/20">

        <h1 className="text-4xl font-extrabold text-white mb-12 text-center tracking-wide drop-shadow-xl">
          Dashboard Navigation
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

          <button
            onClick={() => navigate("/admin")}
            className="group bg-white/10 hover:bg-white/20 transition-all shadow-xl rounded-2xl p-8 w-full text-center border border-white/20 backdrop-blur-md cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-3 text-white text-4xl group-hover:scale-110 transition">
              <FiUsers />
            </div>
            <h2 className="text-xl font-semibold text-white drop-shadow">Roles</h2>
          </button>

          <button
            onClick={() => navigate("/manage")}
            className="group bg-white/10 hover:bg-white/20 transition-all shadow-xl rounded-2xl p-8 w-full text-center border border-white/20 backdrop-blur-md cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-3 text-white text-4xl group-hover:scale-110 transition">
              <FiEdit />
            </div>
            <h2 className="text-xl font-semibold text-white drop-shadow">Manage Questions</h2>
          </button>

          <button
            onClick={() => navigate("/response")}
            className="group bg-white/10 hover:bg-white/20 transition-all shadow-xl rounded-2xl p-8 w-full text-center border border-white/20 backdrop-blur-md cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-3 text-white text-4xl group-hover:scale-110 transition">
              <FiList />
            </div>
            <h2 className="text-xl font-semibold text-white drop-shadow">View Responses</h2>
          </button>

          <button
            onClick={() => navigate("/schedule")}
            className="group bg-white/10 hover:bg-white/20 transition-all shadow-xl rounded-2xl p-8 w-full text-center border border-white/20 backdrop-blur-md cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-3 text-white text-4xl group-hover:scale-110 transition">
              <FiCalendar />
            </div>
            <h2 className="text-xl font-semibold text-white drop-shadow">Interview Scheduling</h2>
          </button>

        </div>
      </div>
    </div>
  );
}
