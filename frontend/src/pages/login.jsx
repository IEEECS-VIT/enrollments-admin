import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";

export default function Login() {
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in:", result.user.email);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-black">
      <button
        onClick={loginWithGoogle}
        className="bg-white px-6 py-3 rounded-lg"
      >
        Login with Google
      </button>
    </div>
  );
}
