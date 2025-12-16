import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiEdit,
  FiList,
  FiCalendar,
  FiPlus,
  FiGrid,
  FiLogOut,
  FiUser
} from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import ieeeLogo from "/logo.png";

export default function ResponsesPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-black px-4 py-10 flex justify-center items-center relative">
      <div className="backdrop-blur-xl bg-white/5 p-6 sm:p-10 md:p-12 rounded-3xl w-full max-w-6xl border border-yellow-500/20 shadow-2xl">
        <div className="flex justify-left mb-6">
          <img
            src={ieeeLogo}
            alt="IEEE Computer Society Logo"
            className="h-12 sm:h-14 md:h-18 w-auto drop-shadow-lg"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-10 text-center tracking-wide">
          Admin Dashboard
        </h1>

        <div className="flex justify-center mb-14">
          <button
            onClick={() => navigate("/domain")}
            className="group bg-black border-yellow-500/40 shadow-xl rounded-2xl px-6 sm:px-10 md:px-12 py-4 sm:py-5 flex items-center gap-4 hover:scale-[1.02] transition"
          >
            <FiGrid className="text-yellow-300 text-2xl group-hover:rotate-3 transition" />
            <span className="text-base sm:text-lg font-semibold text-white">
              View Domain Selection
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
          {[
            { icon: <FiUsers />, label: "Roles", path: "/admin" },
            { icon: <FiEdit />, label: "Manage Questions", path: "/manage" },
            { icon: <FiList />, label: "View Responses", path: "/response" },
            { icon: <FiCalendar />, label: "Interview Scheduling", path: "/schedule" }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="group bg-black border border-yellow-500/20 rounded-3xl p-8 sm:p-10 text-center hover:-translate-y-2 hover:border-yellow-400/60 transition-all shadow-xl"
            >
              <div className="flex justify-center mb-4 text-yellow-300 text-4xl sm:text-5xl group-hover:scale-110 transition">
                {item.icon}
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
                {item.label}
              </h2>
            </button>
          ))}

          <button
            onClick={() => navigate("/create")}
            className="group bg-black rounded-3xl p-10 sm:p-12 text-center hover:-translate-y-2 transition-all shadow-xl sm:col-span-2"
          >
            <div className="flex justify-center mb-4 text-yellow-300 text-5xl group-hover:scale-110 transition">
              <FiPlus />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">
              Create Slot
            </h2>
          </button>

          <div className="absolute top-10 right-4 flex gap-2 sm:gap-3 z-10">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-neutral-800/80 hover:bg-neutral-700 px-3 py-2 rounded-xl text-white text-sm sm:text-base font-medium transition"
            >
              <FiUser />
              <span className="hidden sm:block">Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600/90 hover:bg-red-700 px-3 py-2 rounded-xl text-white text-sm sm:text-base font-medium transition"
            >
              <FiLogOut />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
