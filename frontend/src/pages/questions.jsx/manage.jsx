import { useState } from "react";

export default function Manage() {
  const [questions, setQuestions] = useState([
    { id: 1, text: "What is your favorite framework?", category: "Tech", type: "MCQ", options: ["React", "Vue", "Angular"] },
    { id: 2, text: "How old are you?", category: "Personal", type: "Short Answer", options: [] },
    { id: 3, text: "Do you like dark mode UI?", category: "General", type: "Yes/No", options: ["Yes", "No"] },
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [category, setCategory] = useState("Tech");
  const [questionType, setQuestionType] = useState("MCQ");
  const [search, setSearch] = useState("");
  const [mcqOptions, setMcqOptions] = useState([""]);

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;

    const newEntry = {
      id: Date.now(),
      text: newQuestion,
      category,
      type: questionType,
      options: questionType === "MCQ" ? mcqOptions.filter((o) => o.trim()) : [],
    };

    setQuestions([newEntry, ...questions]);
    setNewQuestion("");
    setMcqOptions([""]);
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

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
    setMcqOptions(mcqOptions.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen w-full bg-black mt-96 p-6 sm:p-10 flex justify-center items-start">
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
              <option value="Tech" className="bg-black text-white">Tech</option>
              <option value="PnM" className="bg-black text-white">PnM</option>
              <option value="Events" className="bg-black text-white">Events</option>
              <option value="Design" className="bg-black text-white">Design</option>
              <option value="General" className="bg-black text-white">General</option>
            </select>

            <select
              className="p-3 rounded-lg bg-white/10 border border-white/30 text-white"
              value={questionType}
              onChange={(e) => {
                setQuestionType(e.target.value);
                if (e.target.value !== "MCQ") setMcqOptions([""]);
              }}
            >
              <option value="MCQ" className="bg-black text-white">MCQ</option>
              <option value="Long Answer" className="bg-black text-white">Long Answer</option>
              <option value="Short Answer" className="bg-black text-white">Short Answer</option>
            </select>
          </div>

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

                <button
                  onClick={addOptionField}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
                >
                  + Add Option
                </button>
              </div>
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

                      {q.type === "MCQ" && (
                        <ul className="mt-2 ml-4 list-disc text-gray-300 text-sm">
                          {q.options.map((opt, idx) => (
                            <li key={idx}>{opt}</li>
                          ))}
                        </ul>
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
