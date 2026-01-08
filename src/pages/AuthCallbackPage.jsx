import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Backend should have exchanged code for token and returned JWT
      // Assuming backend redirected here with JWT in query param: ?token=...
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        localStorage.setItem("access_token", token);
        navigate("/dashboard"); // or home page
      } else {
        navigate("/signin");
      }
    };

    handleCallback();
  }, []);

  return <div className="min-h-screen flex items-center justify-center">Logging in...</div>;
};

export default AuthCallbackPage;
