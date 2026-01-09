import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // adjust path

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        navigate("/signin");
        return;
      }

      // Supabase already stores session internally
      navigate("/dashboard");
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Logging in...
    </div>
  );
};

export default AuthCallbackPage;
