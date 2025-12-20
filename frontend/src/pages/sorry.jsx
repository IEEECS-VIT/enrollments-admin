import BackButton from "../components/backButton";

export default function QuestionsClosed() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-neutral-900 border border-neutral-700 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-red-500 mb-4">
          Denied
        </h1>

        <div className="w-16 h-1 bg-red-500 mx-auto mb-6 rounded-full" />

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8">
          Sorry dudes, managing or modifying quiz questions is no longer allowed at this stage.
          The question submission window has officially closed dudes.
        </p>

        <div className="flex justify-center">
          <BackButton label="Go Back" />
        </div>
      </div>
    </div>
  );
}
