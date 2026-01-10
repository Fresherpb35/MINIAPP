import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../config/supabase'; // ✅ ADD THIS

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
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
      Logging you in...
    </div>
  );
};

export default AuthCallbackPage;
