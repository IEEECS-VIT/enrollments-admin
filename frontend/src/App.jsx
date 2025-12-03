export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Tailwind CSS Test
        </h1>

        <p className="text-gray-600 mb-6">
          If you can see the styling here, Tailwind is working 🎉
        </p>

        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium">
          Test Button
        </button>
      </div>
    </div>
  );
}
