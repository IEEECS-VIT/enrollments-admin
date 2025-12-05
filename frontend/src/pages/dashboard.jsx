import { useNavigate } from "react-router-dom";

export default function ResponsesPage() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black p-10 flex justify-center items-start">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-white/20">

        <h1 className="text-3xl font-bold text-white mb-8 text-center drop-shadow">Navigation</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          <button
            onClick={()=>navigate("/admin")}
            className="bg-white/20 hover:bg-white/30 transition shadow-xl rounded-xl p-6 w-full text-center border border-white/30 backdrop-blur-md cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-white drop-shadow mb-1">Roles</h2>
          </button>

          <button
            onClick={() => navigate("/manage")}
            className="bg-white/20 hover:bg-white/30 transition shadow-xl rounded-xl p-6 w-full text-center border border-white/30 backdrop-blur-md cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-white drop-shadow mb-1">Manage Questions</h2>
          </button>

          <button
          onClick={()=>navigate("/response")}
            className="bg-white/20 hover:bg-white/30 transition shadow-xl rounded-xl p-6 w-full text-center border border-white/30 backdrop-blur-md cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-white drop-shadow mb-1">View Responses</h2>
          </button>

        </div>
      </div>
    </div>
  );
}
