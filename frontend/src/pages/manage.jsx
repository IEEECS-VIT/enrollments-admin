import api from "../api/admin";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import BackButton from "../components/backButton";
export default function Manage() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [category, setCategory] = useState("WEB");
  const [questionType, setQuestionType] = useState("MCQ");
  const [search, setSearch] = useState("");
  const [mcqOptions, setMcqOptions] = useState([""]);
  const [correctIndex, setCorrectIndex] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteText, setDeleteText] = useState("");
  const [deleteType, setDeleteType] = useState("");
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserReady(true);
      if (user) fetchQuestions();
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (userReady && auth.currentUser) fetchQuestions();
  }, [category]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get("/admin/questions", {
        params: { domain: category, round: 1 },
      });

      if (!res.data || res.status === 204) {
        setQuestions([]);
        return;
      }

      const mcq = res.data.mcq_questions || [];
      const desc = res.data.desc_questions || [];

      const formatted = [
        ...mcq.map((q) => ({
          id: Math.random(),
          text: q.question,
          type: "MCQ",
          category,
          options: q.options || [],
          correctIndex: q.correctIndex ?? null,
          image: q.image_url || null,
        })),
        ...desc.map((q) => ({
          id: Math.random(),
          text: q.question,
          type: "Short Answer",
          category,
          options: [],
          image: q.image_url || null,
        })),
      ];

      setQuestions(formatted);
    } catch (err) {}
  };

  const deleteOption = (index) => {
    setMcqOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) return;

    try {
      const formData = new FormData();
      formData.append("domain", category);
      formData.append("round", "1");
      formData.append("question", newQuestion);

      if (questionType === "MCQ") {
        const filtered = mcqOptions.filter((o) => o.trim() !== "");
        formData.append("options", JSON.stringify(filtered));
        if (correctIndex !== "") {
          formData.append("correctIndex", Number(correctIndex));
        }
      }

      if (imageFile) formData.append("image", imageFile);

      await api.post("/admin/questions", formData);

      setNewQuestion("");
      setMcqOptions([""]);
      setCorrectIndex("");
      setImageFile(null);
      setImagePreview(null);

      fetchQuestions();
    } catch (err) {}
  };

  const addOptionField = () => setMcqOptions([...mcqOptions, ""]);

  const handleDeleteQuestion = async () => {
    if (!deleteText.trim() || !deleteType) {
      alert("Enter question text and type");
      return;
    }

    try {
      await api.delete("/admin/delete-question", {
        params: {
          domain: category,
          round: 1,
          question_type: deleteType,
          question_text: deleteText,
        },
      });

      alert("Question deleted successfully");
      setDeleteText("");
      setDeleteType("");

      fetchQuestions();
    } catch (err) {
      alert("Error deleting question");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const r = new FileReader();
      r.onload = () => setImagePreview(r.result);
      r.readAsDataURL(file);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-black p-4 sm:p-8 flex justify-center">
      <div className="bg-white/10 p-6 sm:p-10 rounded-2xl w-full max-w-5xl border border-yellow-500/20 shadow-xl">

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-10">
          <BackButton label="Go Back" />
          <img src="/logo.png" alt="IEEE CS Logo" className="h-12 sm:h-16" />
        </div>

        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 mb-10 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Add New Question</h2>

          <div className="grid grid-cols-1 gap-4">

<textarea
  rows={6}
  className="w-full p-4 sm:p-6 rounded-xl bg-black/20 border border-yellow-500/30 text-white text-base sm:text-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
  value={newQuestion}
  onChange={(e) => setNewQuestion(e.target.value)}
  placeholder="Type your question here..."
/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="p-3 rounded-xl bg-black/20 border border-yellow-500/30 text-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="WEB" className="bg-black">WEB</option>
                <option value="APP" className="bg-black">APP</option>
                <option value="AI/ML" className="bg-black">AI/ML</option>
                <option value="CC" className="bg-black">CC</option>
                <option value="EVENTS" className="bg-black">EVENTS</option>
                <option value="PNM" className="bg-black">PNM</option>
                <option value="UI/UX" className="bg-black">UI/UX</option>
                <option value="VIDEO" className="bg-black">Video Editing</option>
              </select>

              <select
                className="p-3 rounded-xl bg-black/20 border border-yellow-500/30 text-white"
                value={questionType}
                onChange={(e) => {
                  setQuestionType(e.target.value);
                  if (e.target.value !== "MCQ") {
                    setMcqOptions([""]);
                    setCorrectIndex("");
                  }
                }}
              >
                <option value="MCQ" className="bg-black">MCQ</option>
                <option value="Short Answer" className="bg-black">Short Answer</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg text-white mb-2">Attach Image</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 rounded-xl bg-black/20 border border-yellow-500/30 text-white"
            />

            {imagePreview && (
              <img src={imagePreview} className="mt-4 w-40 rounded-xl border border-white/20" />
            )}
          </div>

          {questionType === "MCQ" && (
            <div className="mt-6">
              {mcqOptions.map((opt, i) => (
                <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3"
            >
              <input
                type="text"
                value={opt}
                onChange={(e) =>
                  setMcqOptions((prev) =>
                    prev.map((o, idx) => (idx === i ? e.target.value : o))
                  )
                }
                className="w-full sm:flex-1 p-3 rounded-xl bg-black/20 border border-yellow-500/30 text-white"
                placeholder={`Option ${i + 1}`}
              />

              <button
                onClick={() => deleteOption(i)}
                className="bg-red-600 hover:bg-red-500 active:bg-red-700 px-4 py-2 rounded-xl text-white text-sm sm:text-base w-full sm:w-auto transition"
              >
                Delete
              </button>
            </div>

              ))}

              <select
                className="p-3 rounded-xl bg-black/20 border border-yellow-500/30 text-white mt-2"
                value={correctIndex}
                onChange={(e) => setCorrectIndex(Number(e.target.value))}
              >
                <option value="">Select an option</option>
                {mcqOptions.map((opt, idx) => (
                  <option key={idx} value={idx} className="bg-black text-white">
                    {opt.trim() || `Option ${idx + 1}`}
                  </option>
                ))}
              </select>

              <button
                onClick={addOptionField}
                className="mt-4 ml-4 bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded-xl transition"
              >
                + Add Option
              </button>
            </div>
          )}

          <button
            onClick={handleAddQuestion}
            className="mt-8 w-full bg-green-500 hover:bg-green-400 transition text-white py-3 rounded-xl text-lg font-bold"
          >
            Add Question
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="w-full p-3 rounded-xl bg-black/20 border border-yellow-500/30 text-white mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-neutral-900 p-4 sm:p-6 rounded-2xl max-w-4xl mx-auto mb-10 space-y-4">
          <h2 className="text-xl font-semibold text-red-400">Delete Question</h2>

          <input
            type="text"
            placeholder="Enter EXACT question text"
            className="p-3 w-full rounded-xl bg-black border border-red-500/40 text-white"
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
          />

          <select
            className="p-3 w-full rounded-xl bg-black border border-red-500/40 text-white"
            value={deleteType}
            onChange={(e) => setDeleteType(e.target.value)}
          >
            <option value="">Select question type</option>
            <option value="mcq">MCQ</option>
            <option value="desc">Short Answer</option>
          </select>

          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl w-full font-semibold"
            onClick={handleDeleteQuestion}
          >
            Delete Question
          </button>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl text-white mb-4">All Questions</h2>

          {filteredQuestions.length === 0 ? (
            <p className="text-neutral-400 text-center py-4">No questions found.</p>
          ) : (
            <ul className="space-y-4">
              {filteredQuestions.map((q) => (
                <li key={q.id} className="p-5 bg-black/20 border border-yellow-500/20 rounded-2xl">
                  <p className="text-white font-semibold">{q.text}</p>
                  <p className="text-neutral-400 text-sm">Category: {q.category}</p>
                  <p className="text-neutral-500 text-sm">Type: {q.type}</p>

                  {q.image && <img src={q.image} className="mt-3 w-32 rounded-lg" />}

                  {q.type === "MCQ" && (
                    <>
                      <ul className="mt-2 ml-4 list-disc text-neutral-300 text-sm">
                        {q.options.map((opt, idx) => (
                          <li key={idx}>{opt}</li>
                        ))}
                      </ul>

                      <p className="text-green-400 text-sm mt-2">
                        Correct: {q.options[q.correctIndex]}
                      </p>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
