import api from "../../api/admin";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase";


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
const handleAddQuestion = async () => {
  if (!newQuestion.trim()) return;

  try {
    const token = await auth.currentUser.getIdToken();

    const formData = new FormData();
    formData.append("domain", category);
    formData.append("round", "1");
    formData.append("question", newQuestion);

    if (questionType === "MCQ") {
      const filteredOptions = mcqOptions.filter((opt) => opt.trim() !== "");
      formData.append("options", JSON.stringify(filteredOptions));

      if (correctIndex !== "" && !isNaN(correctIndex)) {
        formData.append("correctIndex", Number(correctIndex));
      }
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    //const token = await auth.currentUser.getIdToken();

    await api.post("/questions", formData, {
      headers: {
        "Authorization": token,
        "Content-Type": "multipart/form-data",
      },
    });


    alert("Question added successfully");
    fetchQuestions();
  } catch (error) {
    console.error(error);
    alert("Error adding question");
  }
};

const fetchQuestions = async () => {
  try {
    const token = await auth.currentUser.getIdToken();

    const response = await api.get("/questions", {
      params: { domain: category, round: 1 },
       headers: { Authorization: token },
    });

    const mcq = response.data.mcq_questions || [];
    const desc = response.data.desc_questions || [];

    const formatted = [
      ...mcq.map((q) => ({
        id: Math.random(),
        text: q.question,
        type: "MCQ",
        category,
        options: q.options,
        correctIndex: q.correctIndex,
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


useEffect(() => {
  fetchQuestions();
}, []);

  const deleteQuestion = (id) => setQuestions(questions.filter((q) => q.id !== id));

  const filteredQuestions = questions.filter(
    (q) =>
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase()) ||
      q.type.toLowerCase().includes(search.toLowerCase())
  );

  const addOptionField = () => setMcqOptions([...mcqOptions, ""]);

  const updateOption = (index, value) => {
    const updated = [...mcqOptions];
    updated[index] = value;
    setMcqOptions(updated);
  };

  const deleteOption = (index) => {
    const updated = mcqOptions.filter((_, i) => i !== index);
    setMcqOptions(updated);

    if (correctIndex == index) setCorrectIndex("");
    else if (correctIndex > index) setCorrectIndex(correctIndex - 1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black p-6 sm:p-10 flex justify-center items-start">
      <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-5xl border border-white/20">

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center drop-shadow">
          Manage Questions
        </h1>

        <div className="bg-white/20 border border-white/30 rounded-xl p-6 shadow-lg backdrop-blur-md mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Add New Question</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Enter your question..."
              className="p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-300"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />

            <select
              className="p-3 rounded-lg bg-white/10 border border-white/30 text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="WEB">Web</option>
              <option value="UI/UX">UI/UX</option>
              <option value="GRAPHIC DESIGN">Graphic Design</option>
              <option value="VIDEO EDITING">Video Editing</option>
              <option value="EVENTS">Events</option>
              <option value="PNM">PnM</option>
              <option value="IOT">IoT</option>
              <option value="APP">App</option>
              <option value="AI/ML">AI/ML</option>
              <option value="RND">RnD</option>
              <option value="CC">Cloud Computing</option>

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
              <option value="MCQ" className="bg-black text-white">MCQ</option>
              <option value="Short Answer" className="bg-black text-white">Short Answer</option>
              
            </select>
          </div>

          {(questionType === "MCQ" || questionType === "Short Answer") && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-2">Attach Image (Optional)</h3>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white"
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="mt-4 w-40 rounded-lg border border-white/30 shadow-md"
                />
              )}
            </div>
          )}

          {questionType === "MCQ" && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-white mb-2">MCQ Options</h3>

              <div className="space-y-3">
                {mcqOptions.map((opt, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-400"
                      value={opt}
                      onChange={(e) => updateOption(index, e.target.value)}
                    />

                    {mcqOptions.length > 1 && (
                      <button
                        onClick={() => deleteOption(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <select
                className="p-3 rounded-lg bg-white/10 border border-white/30 text-white mt-3"
                value={correctIndex}
                onChange={(e) => setCorrectIndex(e.target.value)}
              >
                <option value="" className="bg-black text-white">
                  Select Correct Option
                </option>

                {mcqOptions.map((opt, idx) => (
                  <option key={idx} value={idx} className="bg-black text-white">
                    {opt || `Option ${idx + 1}`}
                  </option>
                ))}
              </select>

              <button
                onClick={addOptionField}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
              >
                + Add Option
              </button>
            </div>
          )}

          <button
            onClick={handleAddQuestion}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg transition w-full sm:w-auto"
          >
            Add Question
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by text, category, or type..."
            className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white/10 border border-white/30 rounded-xl p-6 shadow-lg backdrop-blur-md">
          <h2 className="text-xl font-semibold text-white mb-4">All Questions</h2>

          {filteredQuestions.length === 0 ? (
            <p className="text-gray-300 text-center py-4">No questions found.</p>
          ) : (
            <ul className="space-y-4">
              {filteredQuestions.map((q) => (
                <li key={q.id} className="p-4 bg-white/10 border border-white/20 rounded-xl">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
                    <div>
                      <p className="text-white font-medium">{q.text}</p>
                      <p className="text-gray-300 text-sm">Category: {q.category}</p>
                      <p className="text-gray-400 text-sm">Type: {q.type}</p>

                      {q.image && (
                        <img
                          src={q.image}
                          className="mt-2 w-32 rounded-lg border border-white/20 shadow-md"
                        />
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
                    </div>

                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
