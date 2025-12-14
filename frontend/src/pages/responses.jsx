import { useEffect, useState } from "react";
import api from "../api/admin";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import BackButton from "../components/backButton";
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

    mcq.forEach((q, i) => {
      const correctAnswer = q.options?.[Number(q.correctIndex)];
      const userAnswer = answers?.[i];

      if (
        correctAnswer !== undefined &&
        userAnswer !== undefined &&
        String(userAnswer).trim() === String(correctAnswer).trim()
      ) {
        score++;
      }
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
<BackButton label="Go Back" />
      <div className="bg-neutral-900 p-4 sm:p-6 rounded-2xl max-w-4xl mx-auto mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select
          className="p-3 rounded-xl bg-black border border-neutral-700"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        >
          <option value="WEB">WEB</option>
          <option value="APP">APP</option>
          <option value="AI/ML">AI/ML</option>
          <option value="CC">CC</option>
          <option value="EVENTS">EVENTS</option>
          <option value="PNM">PNM</option>
          <option value="UI/UX">UI/UX</option>
          <option value="VIDEO EDITING">Video Editing</option>
        </select>

        <select
          className="p-3 rounded-xl bg-black border border-neutral-700"
          value={round}
          onChange={(e) => setRound(Number(e.target.value))}
        >
          <option value={1}>Round 1</option>
          <option value={2}>Round 2</option>
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
        <p className="text-center text-neutral-400">Fetching responses…</p>
      ) : (
        <div className="space-y-5 max-w-4xl mx-auto">
          {responses.map((user, idx) => (
            <details
              key={idx}
              className="bg-neutral-900 p-4 sm:p-6 rounded-2xl border border-neutral-700"
            >
              <summary className="cursor-pointer flex justify-between text-lg font-semibold">
                <span className="break-all flex gap-4 items-center">
                  {user.email}
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
                </span>
                <span className="text-yellow-400">
                  Score: {user.score}
                </span>
              </summary>

              <div className="mt-6 space-y-6">
                {user.mcqQuestions.map((q, i) => {
                  const correctAnswer = q.options?.[Number(q.correctIndex)];
                  const userAnswer = user.answers?.[i];

                  return (
                    <div key={i} className="bg-black/40 p-4 rounded-xl">
                      <p className="text-neutral-400">Q{i + 1}</p>
                      <p className="font-semibold mt-1">{q.question}</p>

                      {q.options.map((opt, optIdx) => (
                        <p
                          key={optIdx}
                          className={`px-3 py-2 rounded-lg mt-2 ${
                            opt === correctAnswer
                              ? "bg-green-800 text-white"
                              : opt === userAnswer
                              ? "bg-red-800 text-white"
                              : "bg-neutral-800 text-neutral-300"
                          }`}
                        >
                          {optIdx + 1}. {opt}
                        </p>
                      ))}

                      <p className="text-green-400 mt-3">
                        Correct: {correctAnswer ?? "N/A"}
                      </p>
                      <p
                        className={
                          userAnswer === correctAnswer
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        User: {userAnswer ?? "Not Answered"}
                      </p>
                    </div>
                  );
                })}

                {user.descQuestions.map((q, i) => {
                  const idx2 = user.mcqQuestions.length + i;
                  const userAns = user.answers[idx2];

                  return (
                    <div key={i} className="bg-black/40 p-4 rounded-xl">
                      <p className="text-neutral-400">
                        Q{user.mcqQuestions.length + i + 1}
                      </p>
                      <p className="font-semibold mt-1">{q.question}</p>
                      <p className="text-green-400 mt-3 break-words">
                        {userAns}
                      </p>
                    </div>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
