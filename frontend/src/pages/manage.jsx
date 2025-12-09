import api from "../api/admin";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";


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
    } catch (err) {
      console.error("Fetch error:", err);
    }
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
    } catch (err) {
      console.error(err);
    }
  };

  const addOptionField = () => setMcqOptions([...mcqOptions, ""]);
  const updateOption = (i, val) => {
    const arr = [...mcqOptions];
    arr[i] = val;
    setMcqOptions(arr);
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
    <div className="min-h-screen w-full bg-black p-6 sm:p-10 flex justify-center">
      
      <div className="bg-white/10 p-6 sm:p-8 rounded-2xl w-full max-w-5xl border border-white/20">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Manage Questions
        </h1>

        <div className="bg-white/20 border border-white/30 rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Add New Question</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Enter question..."
              className="p-3 rounded-lg bg-white/10 border border-white/30 text-white"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />

            <select
              className="p-3 rounded-lg bg-white/10 border border-white/30 text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              className="p-3 rounded-lg bg-white/10 border border-white/30 text-white"
              value={questionType}
              onChange={(e) => {
                setQuestionType(e.target.value);
                if (e.target.value !== "MCQ") {
                  setMcqOptions([""]);
                  setCorrectIndex("");
                }
              }}
            >
              <option value="MCQ">MCQ</option>
              <option value="Short Answer">Short Answer</option>
            </select>
          </div>

          <div className="mt-6">
            <h3 className="text-lg text-white mb-2">Attach Image (Optional)</h3>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white"
            />

            {imagePreview && (
              <img
                src={imagePreview}
                className="mt-4 w-40 rounded-lg border border-white/30"
              />
            )}
          </div>

          {questionType === "MCQ" && (
            <div className="mt-4">
              <h3 className="text-lg text-white mb-2">MCQ Options</h3>

              {mcqOptions.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  className="w-full p-3 my-2 rounded-lg bg-white/10 border border-white/30 text-white"
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                />
              ))}

              <select
                className="p-3 rounded-lg bg-black/30 border border-white/30 text-white mt-3"
                value={correctIndex}
                onChange={(e) => setCorrectIndex(e.target.value)}
              >
                <option value="">Select Correct Option</option>
                {mcqOptions.map((opt, idx) => (
                  <option key={idx} value={idx}>
                    {opt || `Option ${idx + 1}`}
                  </option>
                ))}
              </select>

              <button
                onClick={addOptionField}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                + Add Option
              </button>
            </div>
          )}

          <button
            onClick={handleAddQuestion}
            className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg"
          >
            Add Question
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white/10 border border-white/30 rounded-xl p-6">
          <h2 className="text-xl text-white mb-4">All Questions</h2>

          {filteredQuestions.length === 0 ? (
            <p className="text-gray-300 text-center py-4">No questions found.</p>
          ) : (
            <ul className="space-y-4">
              {filteredQuestions.map((q) => (
                <li
                  key={q.id}
                  className="p-4 bg-white/10 border border-white/20 rounded-xl"
                >
                  <p className="text-white font-medium">{q.text}</p>
                  <p className="text-gray-300 text-sm">Category: {q.category}</p>
                  <p className="text-gray-400 text-sm">Type: {q.type}</p>

                  {q.image && (
                    <img src={q.image} className="mt-2 w-32 rounded-lg" />
                  )}

                  {q.type === "MCQ" && (
                    <>
                      <ul className="mt-2 ml-4 list-disc text-gray-300 text-sm">
                        {q.options.map((opt, idx) => (
                          <li key={idx}>{opt}</li>
                        ))}
                      </ul>

                      <p className="text-green-400 text-sm mt-1">
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
