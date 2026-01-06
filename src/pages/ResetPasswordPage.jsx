import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  // 🔹 Extract tokens from URL
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (!access_token || !refresh_token) {
      setError('Invalid or expired reset link');
      return;
    }

    setAccessToken(access_token);
    setRefreshToken(refresh_token);
  }, []);

  const handleReset = async () => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(
        'http://localhost:4000/api/auth/resetpassword',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
            new_password: newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Password reset failed');
        return;
      }

      setSuccess('Password reset successful! Redirecting...');
      setTimeout(() => navigate('/signin'), 2000);

    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-center">
            {success}
          </div>
        )}

        <Input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
        />

        <Button
          onClick={handleReset}
          disabled={loading}
          className="w-full mt-6"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
