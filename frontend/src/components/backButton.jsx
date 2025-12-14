import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function BackButton({ label = "Back", to }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className="
        fixed top-4 left-4 z-50
        flex items-center gap-2
        px-4 py-2
        rounded-full
        bg-black/70 backdrop-blur-md
        border border-white/10
        text-white
        shadow-lg
        hover:bg-white/10
        active:scale-95
        transition-all
      "
      aria-label="Go back"
    >
      <FiArrowLeft className="text-lg" />
      <span className="hidden sm:inline text-sm font-medium">
        {label}
      </span>
    </button>
  );
}
