import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        navigate("/signin", { replace: true });
        return;
      }

      // ✅ Session exists and is stored
      navigate("/home", { replace: true });
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Logging you in...
    </div>
  );
};

export default AuthCallbackPage;
