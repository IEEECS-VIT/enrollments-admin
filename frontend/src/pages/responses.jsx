import { useEffect, useState } from "react";
import api from "../api/admin";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import BackButton from "../components/backButton";


/*
{user.track === "FRONTEND" && <p>Frontend Track</p>}
{user.track === "BACKEND" && <p>Backend Track</p>}
*/
//for seeing separately 

export default function AdminResponses() {
  const [responses, setResponses] = useState([]);
  const [domain, setDomain] = useState("WEB");
  const [accessDenied, setAccessDenied] = useState(false);
const QUESTION_DOMAIN_MAP = {
  "VIDEO EDITING": "VIDEO"
};

  const [round, setRound] = useState(1);
  const [status, setStatus] = useState("unmarked");
  const [loading, setLoading] = useState(true);
  const normalize = (v) => String(v ?? "").trim();
  const [searchEmail, setSearchEmail] = useState("");

  const countAppearedMcqs = (user, mcqQuestions) => {
  const answers = round === 1 ? user.round1 || [] : user.round2 || [];
  const mcqIds = new Set(
    mcqQuestions.map(q => String(q.id || q.uuid))
  );

  // count only answers whose questionId belongs to MCQs
  return answers.filter(a => mcqIds.has(String(a.questionId))).length;
};


const fetchQuestions = async () => {
  const questionDomain = QUESTION_DOMAIN_MAP[domain] || domain;

  const res = await api.get("/admin/questions", {
    params: { domain: questionDomain, round }
  });

    return {
      mcq: res.data?.mcq_questions || [],
      desc: res.data?.desc_questions || []
    };
  };
const totalUsers = responses.length;

const extractAnswers = (user) => {
  if (round === 1) {
    const list = user.round1 || [];
    return Object.fromEntries(
      list.map(a => [String(a.questionId), a.answer])
    );
  }

  const list = user.round2 || [];

  return {
    github: list[0] || null,
    others: list
      .slice(1)
      .flatMap(v => v.split(","))
      .map(v => v.trim())
      .filter(Boolean)
  };
};




  const calculateScore = (answersMap, mcq) => {
    let score = 0;
    mcq.forEach((q) => {
      const qid = String(q.id || q.uuid);
      const correctAnswer = q.options?.[Number(q.correctIndex)];
      const userAnswer = answersMap?.[qid];
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
  setAccessDenied(false);

  try {
    const res = await api.get("/admin/fetch", {
      params: { domain, round, status }
    });

    const raw = res.data?.items || [];
    const { mcq, desc } = await fetchQuestions();

    const computed = raw.map((user) => {
      const answersMap = extractAnswers(user);

      return {
        ...user,
        answersMap,
        score: round === 1 ? calculateScore(answersMap, mcq) : null,
        mcqQuestions: mcq,
        descQuestions: desc,
        appearedMcqs: round === 1 ? countAppearedMcqs(user, mcq) : null
      };
    });

    setResponses(computed);
  } catch (err) {
    if (err?.response?.status === 403) {
      setAccessDenied(true);
      setResponses([]);
    }
  } finally {
    setLoading(false);
  }
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




<div className="relative mb-10 flex items-center">
  <div className="flex-shrink-0">
    <BackButton label="Go Back" />
  </div>

  <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl sm:text-4xl font-bold text-center">
    Responses
  </h1>

</div>



      <div className="bg-neutral-900 p-4 sm:p-6 rounded-2xl max-w-5xl mx-auto mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <select className="p-3 rounded-xl bg-black border border-neutral-700" value={domain} onChange={(e) => setDomain(e.target.value)}>
          <option value="WEB">WEB</option>
          <option value="APP">APP</option>
          <option value="AI/ML">AI/ML</option>
          <option value="CC">CC</option>
          <option value="EVENTS">EVENTS</option>
          <option value="PNM">PNM</option>
          <option value="UI/UX">UI/UX</option>
          <option value="VIDEO EDITING">Video Editing</option>
        </select>

        <select className="p-3 rounded-xl bg-black border border-neutral-700" value={round} onChange={(e) => setRound(Number(e.target.value))}>
          <option value={1}>Round 1</option>
          <option value={2}>Round 2</option>
        </select>

        <select className="p-3 rounded-xl bg-black border border-neutral-700" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="unmarked">Unmarked</option>
          <option value="qualified">Qualified</option>
          <option value="unqualified">Disqualified</option>
        </select>
          <div className="sm:col-span-3 text-center mt-2">
    

  </div>
<input
  type="text"
  placeholder="Search by email"
  value={searchEmail}
  onChange={(e) => setSearchEmail(e.target.value)}
  className="p-3 rounded-xl bg-black border border-neutral-700 text-white sm:col-span-3"
/>


      </div>
<div className="relative mb-6 max-w-xs mx-auto rounded-3xl 
                bg-black
                border border-neutral-700/60 
                px-6 py-5 text-center shadow-xl">
  
  <p className="text-xs uppercase tracking-widest text-neutral-500">
    people
  </p>

  <p className="mt-2 text-4xl font-bold text-white">
    {loading ? "—" : responses.length}
  </p>

  <div className="mt-3 h-[1px] w-12 mx-auto bg-neutral-700/60 rounded-full" />
</div>

      {accessDenied && (
  <div className="max-w-5xl mx-auto mb-10 px-4">
    <div className="bg-black border border-red-500/30 rounded-3xl p-6 sm:p-10 text-center shadow-2xl">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-red-500 tracking-tight mb-4">
        Get Out Man/Woman
      </h1>

      <div className="w-16 h-1 bg-red-500 mx-auto mb-6 rounded-full" />

      <p className="text-neutral-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
        You don’t have permission to view responses for this domain.
        Please switch to another domain from the dropdown.
      </p>
    </div>
  </div>
)}

{loading ? (
  <p className="text-center text-neutral-400">Have Patience</p>
) : accessDenied ? null : (


        <div className="space-y-4 max-w-5xl mx-auto">
          {responses
          .filter(user =>
            user.email.toLowerCase().includes(searchEmail.toLowerCase())
          )
          .map((user, idx) => (

            <details key={idx} className="bg-neutral-900 rounded-2xl border border-neutral-700 overflow-hidden">
              <summary className="cursor-pointer flex flex-col sm:flex-row justify-between gap-4 p-4 sm:p-6">
                <div>
                  <p className="break-all font-semibold text-lg">{user.email}</p>
                  {round === 1 && (
                <p className="text-yellow-400 text-sm">
                  Score: {user.score} / {user.appearedMcqs}
                </p>
              )}

                </div>
                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => markUser(user.email, "qualified")} className="bg-green-600 px-4 py-2 rounded-xl text-sm font-semibold">
                    Qualify
                  </button>
                  <button onClick={() => markUser(user.email, "unqualified")} className="bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold">
                    Disqualify
                  </button>

                </div>
              </summary>

              <div className="px-4 sm:px-6 pb-6 space-y-6">
                
                {round === 1 && user.mcqQuestions.map((q, i) => {
                  const qid = String(q.id || q.uuid);
                  
                  const correctAnswer = q.options?.[Number(q.correctIndex)];
                  
                  const userAnswer = user.answersMap?.[qid];
                    const isCorrect =normalize(userAnswer) === normalize(correctAnswer);
                  
                  if (userAnswer == null || userAnswer === "N/A") return null;

                  return (
                    <div key={qid} className="bg-black/40 p-4 rounded-xl">
                      <p className="text-neutral-400">Q{i + 1}</p>
                      <p className="font-semibold mt-1">{q.question}</p>

   {q.options.map((opt, optIdx) => {
  const isUser = normalize(opt) === normalize(userAnswer);
  const isRight = normalize(opt) === normalize(correctAnswer); //had to normalize 

  return (
    <p
      key={optIdx}
      className={`px-3 py-2 rounded-lg mt-2 ${
        isRight
          ? "bg-green-500"
          : isUser
          ? "bg-red-500"
          : "bg-neutral-800"
      }`}
    >
      {optIdx + 1}. {opt}
    </p>
  );
})}


                        
                      <p className="mt-3 text-green-400">
                        Correct : {correctAnswer ?? "N/A"}
                      </p>
                      <p className={`mt-1 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                      User : {userAnswer ?? "N/A"}
                    
                      </p>
                    </div>
                    
                  );
                })}
{round === 2 && (
  <div className="bg-black/40 p-4 rounded-xl border border-neutral-700">
    <p className="text-sm text-neutral-400 mb-3">
      Submitted Links
    </p>


    {user.answersMap?.github ? (
      <a
        href={user.answersMap.github}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-blue-400 underline break-all"
      >
        GitHub Repository
      </a>
    ) : (
      <p className="text-red-400 text-sm">No GitHub link</p>
    )}

   
    {user.answersMap?.others?.length > 0 && (
      <div className="mt-3 space-y-1">
        {user.answersMap.others.map((link, idx) => (
          <a
            key={idx}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-purple-400 underline break-all text-sm"
          >
            Other Link {idx + 1}
          </a>
        ))}
      </div>
    )}
  </div>
)}


                {round === 1 && user.descQuestions.map((q) => {
  const qid = String(q.id || q.uuid);
  const userAns = user.answersMap?.[qid];

  return (
    <div key={qid} className="bg-black/40 p-4 rounded-xl">
      <p className="font-semibold">{q.question}</p>
      <p className="text-red-400 mt-2 break-words">
        {userAns ?? "N/A"}
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
