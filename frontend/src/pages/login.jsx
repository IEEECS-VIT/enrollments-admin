import { useEffect, useState } from "react";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  const navigate = useNavigate();
  const INACTIVITY_LIMIT = 5 * 60 * 1000;
  let inactivityTimer;

  const resetTimer = () => {
    if (!loggedIn) return;
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => handleLogout(true), INACTIVITY_LIMIT);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    return () => events.forEach((e) => window.removeEventListener(e, resetTimer));
  }, [loggedIn]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo({
          name: user.displayName || "",
          email: user.email || ""
        });
        setLoggedIn(true);
        resetTimer();
      } else {
        setLoggedIn(false);
        setUserInfo({ name: "", email: "" });
      }
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUserInfo({
        name: result.user.displayName,
        email: result.user.email
      });
      setLoggedIn(true);
      resetTimer();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async (auto) => {
    await signOut(auth);
    setLoggedIn(false);
    clearTimeout(inactivityTimer);
    if (auto) alert("You were logged out due to inactivity.");
    navigate("/");
  };

  const goToDashboard = () => navigate("/dashboard");

  return (
    <div className="h-screen w-full bg-black flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 w-full max-w-md text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-10 tracking-wide">Admin Login</h1>

        {!loggedIn && (
          <button
            onClick={loginWithGoogle}
            className="w-full bg-white/90 hover:bg-white text-black font-semibold py-3 rounded-xl shadow-lg transition text-lg"
          >
            Login with Google
          </button>
        )}

        {loggedIn && (
          <div className="mt-6 bg-white/10 border border-white/20 p-5 rounded-2xl backdrop-blur-xl shadow-inner text-left space-y-2">
            <p className="text-white text-lg font-semibold">{userInfo.name}</p>
            <p className="text-neutral-300">{userInfo.email}</p>
          </div>
        )}

        <button
          onClick={goToDashboard}
          disabled={!loggedIn}
          className={`w-full mt-6 py-3 rounded-xl text-lg font-semibold transition shadow-lg ${
            loggedIn
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
          }`}
        >
          Go to Dashboard
        </button>

        {loggedIn && (
          <button
            onClick={() => handleLogout(false)}
            className="w-full mt-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-lg shadow-lg transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
