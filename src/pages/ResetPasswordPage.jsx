import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    console.log("🔹 ResetPasswordPage mounted");
    console.log("🔹 Full URL:", window.location.href);
    console.log("🔹 URL hash:", window.location.hash);

    const initRecovery = async () => {
      try {
        console.log("🔹 Starting recovery init");

        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);

        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        console.log("🔹 Parsed hash params:", {
          type,
          accessToken,
          refreshToken,
        });

        if (type !== "recovery") {
          console.error("❌ Invalid type:", type);
          setError("Invalid reset link type. Please request a new one.");
          return;
        }

        if (!accessToken || !refreshToken) {
          console.error("❌ Missing tokens");
          setError("Missing authentication tokens. Please request a new reset link.");
          return;
        }

        console.log("🔹 Calling supabase.auth.setSession()");

        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("❌ Session error:", error);
          setError("Invalid or expired reset link. Please request a new one.");
          return;
        }

        console.log("✅ Session created:", data);

        if (!data?.session) {
          console.error("❌ No session returned");
          setError("Failed to establish session. Please request a new reset link.");
          return;
        }

        console.log("✅ Recovery session ready");
        setReady(true);
      } catch (err) {
        console.error("❌ Recovery exception:", err);
        setError("An error occurred. Please try again.");
      }
    };

    initRecovery();
  }, []);

  const handleReset = async () => {
    console.log("🔹 Reset button clicked");

    if (newPassword.length < 6) {
      console.error("❌ Password too short");
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      console.error("❌ Passwords do not match");
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    console.log("🔹 Updating password");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("❌ Password update error:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    console.log("✅ Password updated successfully");

    await supabase.auth.signOut();
    console.log("🔹 Signed out, redirecting to signin");

    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Your Password
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
            {error}
          </div>
        )}

        {ready ? (
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />

            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              onClick={handleReset}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        ) : (
          !error && (
            <p className="text-center text-gray-600">
              Verifying reset link…
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
