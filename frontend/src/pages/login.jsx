import { useEffect, useState } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user); 
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in:", result.user.email);
      setLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="h-screen flex flex-col gap-6 justify-center items-center bg-black">

      <button
        onClick={loginWithGoogle}
        className="bg-white px-6 py-3 rounded-lg text-black font-semibold"
      >
        Login with Google
      </button>

      
      <button
        onClick={goToDashboard}
        disabled={!loggedIn}
        className={`px-6 py-3 rounded-lg font-semibold 
          ${loggedIn ? "bg-green-500 text-white" : "bg-gray-500 text-gray-300 cursor-not-allowed"}`}
      >
        Go to Dashboard
      </button>

    </div>
  );
}
