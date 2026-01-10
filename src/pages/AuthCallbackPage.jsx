import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // 1. Most important: Check current session immediately (catches 90% of cases)
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          console.log("Session found right away:", session.user?.email);
          setStatus("success");
          setTimeout(() => {
            navigate("/home", { replace: true });
          }, 800); // small delay = better UX
          return;
        }

        // 2. Fallback: Listen for session if it arrives slightly later
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, newSession) => {
          if (newSession) {
            console.log("Session arrived via listener:", newSession.user?.email);
            setStatus("success");
            setTimeout(() => {
              navigate("/home", { replace: true });
            }, 800);
          }
        });

        // 3. Safety: try to force refresh (sometimes helps)
        await supabase.auth.refreshSession();

        // Cleanup
        return () => subscription.unsubscribe();
      } catch (err) {
        console.error("Auth callback error:", err);
        setStatus("error");
        setTimeout(() => navigate("/", { replace: true }), 3000);
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      {status === "loading" && (
        <>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Finalizing your login...</h2>
          <p className="text-gray-600">Please wait a moment</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-green-700 mb-3">Welcome back!</h2>
          <p className="text-gray-600">Redirecting you...</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-6 max-w-md">
            We couldn't complete the login. Please try again.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Back to Sign In
          </button>
        </>
      )}
    </div>
  );
}