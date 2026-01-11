import { useEffect, useState } from "react";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  const ACTIVITY_LIMIT = 20 * 60 * 1000;
  const LAST_ACTIVE_KEY = "lastActiveTime";

  const updateLastActive = () => {
    if (loggedIn) {
      localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    }
  };

  const handleLogout = async (auto) => {
    await signOut(auth);
    localStorage.removeItem(LAST_ACTIVE_KEY);
    setLoggedIn(false);
    if (auto) alert("You were logged out dude.");
    navigate("/");
  };

  const checkInactivity = async () => {
    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    if (!lastActive) return;

    if (Date.now() - Number(lastActive) >= ACTIVITY_LIMIT) {
      await handleLogout(true);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
        if (
          lastActive &&
          Date.now() - Number(lastActive) >= ACTIVITY_LIMIT
        ) {
          await signOut(auth);
          localStorage.removeItem(LAST_ACTIVE_KEY);
          return;
        }

        setUserInfo({
          name: user.displayName || "",
          email: user.email || ""
        });
        setLoggedIn(true);
        updateLastActive();
      } else {
        setLoggedIn(false);
        setUserInfo({ name: "", email: "" });
        localStorage.removeItem(LAST_ACTIVE_KEY);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    const interval = setInterval(checkInactivity, 60000);
    return () => clearInterval(interval);
  }, [loggedIn]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, updateLastActive));
    return () =>
      events.forEach((e) =>
        window.removeEventListener(e, updateLastActive)
      );
  }, [loggedIn]);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    setUserInfo({
      name: result.user.displayName,
      email: result.user.email
    });
    setLoggedIn(true);
    updateLastActive();
  };

  const goToDashboard = () => navigate("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div
        className="relative w-full max-w-md sm:max-w-lg p-1 rounded-3xl shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(0,0,0,0.16))"
        }}
      >
        <div
          className="absolute -inset-1 rounded-3xl blur-xl opacity-30"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,223,0,0.15), rgba(255,180,0,0.06))"
          }}
        />
        <div className="relative bg-black/80 backdrop-blur-md border border-yellow-600/30 rounded-3xl p-6 sm:p-8 text-center">
          <div className="flex justify-center mt-4 sm:mt-6">
            <img
              src="/logo.png"
              alt="IEEE CS Logo"
              className="w-24 sm:w-28 md:w-32 h-auto"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-6 tracking-tight">
            Admin Login
          </h1>

          {!loggedIn && (
            <button
              onClick={loginWithGoogle}
              className="mt-8 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold shadow-lg hover:scale-[1.01] active:scale-[0.99] transition"
            >
              <div className="flex items-center justify-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 48 48"
                >
                  <path fill="#FFC107" d="M43.611,20.083H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20c0-1.341-0.138-2.65-0.389-3.917z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4c-7.682,0-14.344,4.337-17.694,10.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24c0-1.341-0.138-2.65-0.389-3.917z"/>
                </svg>
                <span className="text-base sm:text-lg">Continue with Google</span>
              </div>
            </button>
          )}

          {loggedIn && (
            <>
              <div className="mt-7 bg-black/60 border border-yellow-700/30 p-4 rounded-2xl flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
                  {userInfo.name
                    ? userInfo.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold">{userInfo.name}</div>
                  <div className="text-xs sm:text-sm text-yellow-100/70 break-all">
                    {userInfo.email}
                  </div>
                </div>
              </div>

              <button
                onClick={goToDashboard}
                className="mt-6 w-full py-3 rounded-xl text-base sm:text-lg font-semibold bg-black/80 border border-yellow-400 text-white hover:bg-black/70 transition shadow-lg"
              >
                Go to Dashboard
              </button>

              <button
                onClick={() => handleLogout(false)}
                className="mt-4 w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-base sm:text-lg shadow-md transition"
              >
                Logout
              </button>
            </>
          )}

          <div className="mt-6 text-xs sm:text-sm text-yellow-100/60">
            Session will expire after 20 minutes of inactivity
          </div>
        </div>
      </div>
    </div>
  );
}
