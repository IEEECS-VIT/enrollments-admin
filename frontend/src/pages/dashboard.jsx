import { useNavigate } from "react-router-dom";
import { FiUsers, FiEdit, FiList, FiCalendar } from "react-icons/fi";
import ieeeLogo from "/logo.png";

export default function ResponsesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-neutral-950 to-yellow-600 p-10 flex justify-center items-center">
      
      <div className="bg-white/10  p-10 rounded-3xl w-full max-w-4xl border border-yellow-500/20">

        <div className="flex justify-center mb-6">
          <img
            src={ieeeLogo}
            alt="IEEE Computer Society Logo"
            className="h-14 md:h-20 w-auto "
          />
        </div>

        <h1 className="text-4xl font-bold text-yellow-400 mb-12 text-center tracking-wide">
          Dashboard 
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

          <button
            onClick={() => navigate("/admin")}
            className="group bg-black/40 border border-yellow-500/30 hover:border-yellow-400 hover:bg-black/60 transition-all shadow-xl rounded-3xl p-8 w-full text-center backdrop-blur-xl cursor-pointer transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,221,0,0.5)]"
          >
            <div className="flex justify-center mb-3 text-yellow-300 text-4xl group-hover:scale-110 transition">
              <FiUsers />
            </div>
            <h2 className="text-xl font-semibold text-white drop-shadow">Roles</h2>
          </button>

          <button
            onClick={() => navigate("/manage")}
            className="group bg-black/40 border border-yellow-500/30 hover:border-yellow-400 hover:bg-black/60 transition-all rounded-3xl p-8 w-full text-center cursor-pointer transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,221,0,0.5)]"
          >
            <div className="flex justify-center mb-3 text-yellow-300 text-4xl group-hover:scale-110 transition">
              <FiEdit />
            </div>
            <h2 className="text-xl font-semibold text-white drop-shadow">Manage Questions</h2>
          </button>

          <button
            onClick={() => navigate("/response")}
            className="group bg-black/40 border border-yellow-500/30 hover:border-yellow-400 hover:bg-black/60 transition-all shadow-xl rounded-3xl p-8 w-full text-center backdrop-blur-xl cursor-pointer transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,221,0,0.5)]"
          >
            <div className="flex justify-center mb-3 text-yellow-300 text-4xl group-hover:scale-110 transition">
              <FiList />
            </div>
            <h2 className="text-xl font-semibold text-white drop-shadow">View Responses</h2>
          </button>

          <button
            onClick={() => navigate("/schedule")}
            className="group bg-black/40 border border-yellow-500/30 hover:border-yellow-400 hover:bg-black/60 transition-all shadow-xl rounded-3xl p-8 w-full text-center backdrop-blur-xl cursor-pointer transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,221,0,0.5)]"
          >
            <div className="flex justify-center mb-3 text-yellow-300 text-4xl group-hover:scale-110 transition">
              <FiCalendar />
            </div>
            <h2 className="text-xl font-semibold text-white drop-shadow">Interview Scheduling</h2>
          </button>

        </div>
      </div>
    </div>
  );
}
