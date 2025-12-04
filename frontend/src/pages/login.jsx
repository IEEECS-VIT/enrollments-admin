import { useEffect, useState } from "react";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const INACTIVITY_LIMIT = 5 * 60 * 1000; 

  let inactivityTimer;

  const resetTimer = () => {
    if (!loggedIn) return;
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      handleLogout(true); 
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [loggedIn]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        resetTimer(); 
      } else {
        setLoggedIn(false);
      }
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in:", result.user.email);
      setLoggedIn(true);
      resetTimer();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async (auto = false) => {
    await signOut(auth);
    setLoggedIn(false);
    clearTimeout(inactivityTimer);

    if (auto) {
      alert("You were logged out due to inactivity.");
    }

    navigate("/");
  };

  const goToDashboard = () => navigate("/dashboard");

  return (
    <div className="h-screen flex flex-col gap-6 justify-center items-center bg-black text-white">

      {!loggedIn && (
        <button
          onClick={loginWithGoogle}
          className="bg-white px-6 py-3 rounded-lg text-black font-semibold"
        >
          Login with Google
        </button>
      )}

      <button
        onClick={goToDashboard}
        disabled={!loggedIn}
        className={`px-6 py-3 rounded-lg font-semibold 
          ${loggedIn ? "bg-green-500 text-white" : "bg-gray-500 text-gray-300 cursor-not-allowed"}`}
      >
        Go to Dashboard
      </button>

      {loggedIn && (
        <button
          onClick={() => handleLogout(false)}
          className="bg-red-500 px-6 py-3 rounded-lg text-white font-semibold"
        >
          Logout
        </button>
      )}

    </div>
  );
}
