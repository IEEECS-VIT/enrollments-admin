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

  const [searchEmail, setSearchEmail] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) fetchResponses();
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (auth.currentUser) fetchResponses();
  }, [domain, round, status]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get("/admin/questions", {
        params: { domain, round }
      });

      const mcq = res.data?.mcq_questions || [];
      return mcq;
    } catch (e) {
      console.log("Question fetch error:", e);
      return [];
    }
  };

  const calculateScore = (userAnswers, mcqQuestions) => {
    let score = 0;

    userAnswers.forEach((ans, i) => {
      const q = mcqQuestions[i];
      if (!q) return;

      if (q.correctIndex !== undefined && ans.answer === q.options[q.correctIndex]) {
        score++;
      }
    });

    return score;
  };

  const fetchResponses = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/fetch", {
        params: { domain, round, status }
      });

      const items = Array.isArray(res.data?.items) ? res.data.items : [];

      const mcqQuestions = await fetchQuestions();

      const computed = items.map((user) => ({
        ...user,
        score: calculateScore(user.answers || [], mcqQuestions)
      }));

      setResponses(computed);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const markUser = async (email, newStatus) => {
    try {
      await api.post("/admin/qualify", {
        user_email: email,
        domain,
        status: newStatus,
        round
      });

      fetchResponses();
    } catch (err) {
      console.log("Qualify error:", err);
    }
  };

  const deleteUser = async (email) => {
    try {
      await api.post("/admin/delete-responses", null, {
        params: { email }
      });

      fetchResponses();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const searchUser = async () => {
    try {
      const res = await api.get("/admin/search", {
        params: { email: searchEmail }
      });

      setSearchedUser(res.data);
    } catch (err) {
      setSearchedUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Review Responses</h1>


      <div className="max-w-xl mx-auto mb-10 flex gap-3">
        <input
          type="text"
          placeholder="Search by email"
          className="flex-1 p-3 rounded-xl bg-neutral-800 text-white"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <button
          onClick={searchUser}
          className="px-6 bg-yellow-500 text-black rounded-xl font-semibold"
        >
          Search
        </button>
      </div>

      {searchedUser && (
        <div className="max-w-xl mx-auto bg-neutral-900 p-5 rounded-2xl border border-neutral-700 mb-10">
          <p className="font-bold text-xl">{searchedUser.email}</p>
          <p className="text-neutral-300 mt-2">Round 1: {JSON.stringify(searchedUser.status1)}</p>
          <p className="text-neutral-300 mt-2">Round 2: {JSON.stringify(searchedUser.status2)}</p>
        </div>
      )}

      <div className="bg-neutral-900 p-6 rounded-2xl max-w-4xl mx-auto mb-10 grid grid-cols-3 gap-4">
        <select
          className="p-3 rounded-xl bg-black border border-neutral-700"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        >
          <option value="WEB">WEB</option>
          <option value="EVENTS">UI/UX</option>
          <option value="PNM">UI/UX</option>
          <option value="UI/UX">UI/UX</option>
          <option value="APP">APP</option>
          <option value="AI/ML">AI/ML</option>
          <option value="CC">Competitive</option>
        </select>

        <select
          className="p-3 rounded-xl bg-black border border-neutral-700"
          value={round}
          onChange={(e) => setRound(Number(e.target.value))}
        >
          <option value="1">Round 1</option>
          <option value="2">Round 2</option>
        </select>

        <select
          className="p-3 rounded-xl bg-black border border-neutral-700"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="unmarked">Unmarked</option>
          <option value="qualified">Qualified</option>
          <option value="unqualified">Unqualified</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-neutral-400 animate-pulse">Fetching responses…</p>
      ) : (
        <div className="space-y-5 max-w-4xl mx-auto">
          {responses.map((user, idx) => (
            <details
              key={idx}
              className="bg-neutral-900 p-6 rounded-2xl border border-neutral-700"
            >
              <summary className="cursor-pointer flex justify-between text-lg font-semibold">
                <span>{user.email}</span>
                <span className="text-yellow-400">Score: {user.score}</span>
              </summary>

              <div className="mt-4 space-y-3">
                {user.answers?.map((ans, q) => (
                  <div key={q} className="bg-black/40 p-4 rounded-xl">
                    <p className="text-neutral-400">Q{q + 1}</p>

                    <p className="font-semibold mt-1">{ans.question}</p>

                    <p className="text-green-400 mt-2">{ans.answer}</p>
                  </div>
                ))}

                <div className="flex gap-4 mt-4">
                  <button
                    className="bg-green-600 px-4 py-2 rounded-xl"
                    onClick={() => markUser(user.email, "qualified")}
                  >
                    Qualify
                  </button>
                  <button
                    className="bg-red-600 px-4 py-2 rounded-xl"
                    onClick={() => markUser(user.email, "unqualified")}
                  >
                    Disqualify
                  </button>
                  <button
                    className="bg-yellow-600 px-4 py-2 rounded-xl text-black"
                    onClick={() => deleteUser(user.email)}
                  >
                    Delete Responses
                  </button>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
