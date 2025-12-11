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

  const fetchQuestions = async () => {
    const res = await api.get("/admin/questions", {
      params: { domain, round }
    });

    return {
      mcq: res.data?.mcq_questions || [],
      desc: res.data?.desc_questions || []
    };
  };

  const extractAnswers = (user) => {
    if (round === 1) return user.round1 || [];

    if (domain === "WEB" && round === 2) {
      if (user.track === "FRONTEND") return user.frontend || [];
      if (user.track === "BACKEND") return user.backend || [];
      return [];
    }

    return user.round2 || [];
  };

  const calculateScore = (answers, mcq) => {
    let score = 0;

    mcq.forEach((q, index) => {
      const correctIdx = Number(q.correctIndex);
      const userAns = answers[index];

      if (userAns == null) return;

      const isCorrect =
        userAns.toString().trim() === correctIdx.toString() ||
        userAns.toString().trim() === q.options[correctIdx];

      if (isCorrect) score++;
    });

    return score;
  };

  const fetchResponses = async () => {
    setLoading(true);

    const res = await api.get("/admin/fetch", {
      params: { domain, round, status }
    });

    let raw = [];

    if (domain === "WEB" && round === 2) {
      const rd = res.data?.items?.round2 || {};
      raw = [
        ...(rd.FRONTEND || []).map((u) => ({ ...u, track: "FRONTEND" })),
        ...(rd.BACKEND || []).map((u) => ({ ...u, track: "BACKEND" }))
      ];
    } else {
      raw = res.data?.items || [];
    }

    const { mcq, desc } = await fetchQuestions();

    const computed = raw.map((user) => {
      const answers = extractAnswers(user);

      return {
        ...user,
        answers,
        score: calculateScore(answers, mcq),
        mcqQuestions: mcq,
        descQuestions: desc
      };
    });

    setResponses(computed);
    setLoading(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => u && fetchResponses());
    return () => unsub();
  }, []);

  useEffect(() => {
    auth.currentUser && fetchResponses();
  }, [domain, round, status]);

  const markUser = async (email, newStatus) => {
    await api.post("/admin/qualify", {
      user_email: email,
      domain,
      status: newStatus,
      round
    });
    fetchResponses();
  };
return (
  <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-10">
    <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">
      Review Responses
    </h1>

    <div className="bg-neutral-900 p-4 sm:p-6 rounded-2xl max-w-4xl mx-auto mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <select
        className="p-3 rounded-xl bg-black border border-neutral-700 w-full text-sm sm:text-base"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      >
        <option value="WEB">WEB</option>
        <option value="EVENTS">EVENTS</option>
        <option value="PNM">PNM</option>
        <option value="UI/UX">UI/UX</option>
        <option value="APP">APP</option>
        <option value="AI/ML">AI/ML</option>
        <option value="CC">Competitive Coding</option>
      </select>

      <select
        className="p-3 rounded-xl bg-black border border-neutral-700 w-full text-sm sm:text-base"
        value={round}
        onChange={(e) => setRound(Number(e.target.value))}
      >
        <option value="1">Round 1</option>
        <option value="2">Round 2</option>
      </select>

      <select
        className="p-3 rounded-xl bg-black border border-neutral-700 w-full text-sm sm:text-base"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="unmarked">Unmarked</option>
        <option value="qualified">Qualified</option>
        <option value="unqualified">Unqualified</option>
      </select>
    </div>

    {loading ? (
      <p className="text-center text-neutral-400 animate-pulse">
        Fetching responses…
      </p>
    ) : (
      <div className="space-y-5 max-w-4xl mx-auto">
        {responses.map((user, idx) => (
          <details
            key={idx}
            className="bg-neutral-900 p-4 sm:p-6 rounded-2xl border border-neutral-700"
          >
            <summary className="cursor-pointer flex flex-col sm:flex-row sm:justify-between gap-2 text-lg font-semibold">
              <span className="break-all text-sm sm:text-base">{user.email}</span>
              <span className="text-yellow-400 text-sm sm:text-base">
                Score: {user.score}
              </span>
            </summary>

            <div className="mt-6 space-y-6">

              {user.mcqQuestions.map((q, i) => {
                const userAnsRaw = user.answers[i];
                const correctIdx = Number(q.correctIndex);
                const userIdx = Number(userAnsRaw);

                return (
                  <div key={i} className="bg-black/40 p-4 rounded-xl text-sm sm:text-base">
                    <p className="text-neutral-400">Q{i + 1}</p>
                    <p className="font-semibold mt-1">{q.question}</p>

                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === correctIdx;
                      const isUser = optIdx === userIdx;

                      let bg = "bg-neutral-800 text-neutral-300";

                      if (isUser && isCorrect) bg = "bg-green-600 text-black font-bold";
                      else if (isUser && !isCorrect) bg = "bg-yellow-500 text-black font-bold";
                      else if (!isUser && isCorrect) bg = "bg-green-900 border border-green-500";

                      return (
                        <p
                          key={optIdx}
                          className={`px-3 py-2 rounded-lg mt-2 ${bg}`}
                        >
                          {optIdx + 1}. {opt}
                        </p>
                      );
                    })}
                  </div>
                );
              })}

              {user.descQuestions.map((q, i) => {
                const idx = user.mcqQuestions.length + i;
                const userAns = user.answers[idx];

                return (
                  <div key={i} className="bg-black/40 p-4 rounded-xl text-sm sm:text-base">
                    <p className="text-neutral-400">
                      Q{user.mcqQuestions.length + i + 1}
                    </p>
                    <p className="font-semibold mt-1">{q.question}</p>
                    <p className="text-green-400 mt-3 break-words">{userAns}</p>
                  </div>
                );
              })}

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  className="bg-green-600 px-4 py-2 rounded-xl w-full sm:w-auto"
                  onClick={() => markUser(user.email, "qualified")}
                >
                  Qualify
                </button>

                <button
                  className="bg-red-600 px-4 py-2 rounded-xl w-full sm:w-auto"
                  onClick={() => markUser(user.email, "unqualified")}
                >
                  Disqualify
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
