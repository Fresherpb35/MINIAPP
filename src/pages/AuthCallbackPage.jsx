import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // ✅ Session is now guaranteed
          navigate("/home", { replace: true });
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Completing login...
    </div>
  );
};

export default AuthCallbackPage;
