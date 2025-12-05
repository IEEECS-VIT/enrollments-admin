import { useEffect, useState } from "react";
import api from "../api/admin";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminResponses() {
  const [responses, setResponses] = useState([]);
  const [domain, setDomain] = useState("WEB");
  const [round, setRound] = useState(1);
  const [status, setStatus] = useState("unmarked");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) fetchResponses();
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (auth.currentUser) fetchResponses();
  }, [domain, round, status]);

  const fetchResponses = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/fetch", {
        params: { domain, round, status },
      });

      console.log("API DATA:", res.data);

      const items = Array.isArray(res.data?.items) ? res.data.items : [];
      setResponses(items);

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 flex justify-center">
      <div className="w-full max-w-6xl text-white">

        <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
          Review User Responses
        </h1>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-2xl grid sm:grid-cols-3 gap-5 mb-10">

          <select
            className="p-3 bg-black/30 border border-white/20 rounded-xl"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            <option value="WEB">Web</option>
            <option value="UI/UX">UI/UX</option>
            <option value="GRAPHIC DESIGN">Graphic Design</option>
            <option value="APP">App</option>
            <option value="AI/ML">AI/ML</option>
            <option value="CC">Cloud</option>
          </select>

          <select
            className="p-3 bg-black/30 border border-white/20 rounded-xl"
            value={round}
            onChange={(e) => setRound(Number(e.target.value))}
          >
            <option value="1">Round 1</option>
            <option value="2">Round 2</option>
          </select>

          <select
            className="p-3 bg-black/30 border border-white/20 rounded-xl"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="unmarked">Unmarked</option>
            <option value="qualified">Qualified</option>
            <option value="disqualified">Disqualified</option>
          </select>

        </div>

        {loading && (
          <p className="text-center text-gray-400 animate-pulse text-lg">
            Fetching responses…
          </p>
        )}

        {!loading && responses.length === 0 && (
          <p className="text-center text-gray-500">No responses found.</p>
        )}

        <div className="space-y-4">
          {responses.map((user, i) => (
            <details
              key={i}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-5 shadow-lg hover:bg-white/20 transition-all"
            >
              <summary className="cursor-pointer text-lg font-semibold flex justify-between items-center">
                <span>{user.email}</span>
                <span className="text-gray-300">
                  Score: {user.score ?? "N/A"}
                </span>
              </summary>

              <div className="mt-4 space-y-4">
                {user.answers?.map((ans, idx) => (
                  <div key={idx} className="bg-black/40 p-4 rounded-xl shadow-inner">
                    <p className="text-gray-400 text-sm mb-1">Q{idx + 1}</p>
                    <p className="font-semibold">{ans.question}</p>

                    {ans.image_url && (
                      <img
                        src={ans.image_url}
                        className="mt-3 w-48 rounded-lg border border-white/20"
                      />
                    )}

                    <p className="mt-3 text-green-400 font-medium">
                      {ans.answer}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>

      </div>
    </div>
  );
}
