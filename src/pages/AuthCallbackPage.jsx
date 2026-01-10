import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // 1. First — check if we already have a session (most common case)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session) {
          // Session already exists → success!
          setStatus("success");
          setTimeout(() => {
            navigate("/home", { replace: true });
          }, 600); // small delay for better UX
          return;
        }

        // 2. If no session yet → listen for auth change (OAuth flow)
        const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (newSession) {
            setStatus("success");
            setTimeout(() => {
              navigate("/home", { replace: true });
            }, 600);
          }
        });

        // 3. Optional: try to refresh session (sometimes needed)
        await supabase.auth.refreshSession();

        // Cleanup
        return () => {
          listener.subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Auth callback error:", err);
        setStatus("error");
        setTimeout(() => navigate("/", { replace: true }), 2500);
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      {status === "loading" && (
        <>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing login...</h2>
          <p className="text-gray-600">Please wait a moment</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Redirecting you...</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-6 text-center max-w-md">
            We couldn't complete authentication. Please try signing in again.
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
};

export default AuthCallbackPage;