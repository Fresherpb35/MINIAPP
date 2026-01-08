// pages/MagicResetPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';

const MagicResetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  const [requiresReset, setRequiresReset] = useState(false); // true if user must reset password

  // 🔹 Extract tokens from URL (supports both hash or query)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let access_token = params.get('access_token');
    let refresh_token = params.get('refresh_token');

    // fallback: check hash
    if (!access_token || !refresh_token) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      access_token = hashParams.get('access_token');
      refresh_token = hashParams.get('refresh_token');
    }

    if (!access_token || !refresh_token) {
      setError('Invalid or expired link');
      return;
    }

    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    // 🔹 Decide if this is a password reset or magic login
    axios
      .post('https://yourbackend.com/api/auth/check-reset', {
        access_token,
        refresh_token,
      })
      .then((res) => {
        if (res.data.requiresReset) {
          setRequiresReset(true); // show password input
        } else {
          // magic login: save tokens and redirect
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          navigate('/home');
        }
      })
      .catch(() => setError('Invalid or expired link'));
  }, [location.search, navigate]);

  // 🔹 Handle password reset
  const handleReset = async () => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.put(
        'https://yourbackend.com/api/auth/resetpassword',
        {
          access_token: accessToken,
          refresh_token: refreshToken,
          new_password: newPassword,
        }
      );

      if (res.data.success) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setSuccess('Password reset successful! Redirecting...');
        setTimeout(() => navigate('/home'), 2000);
      } else {
        setError(res.data.message || 'Password reset failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!requiresReset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Verifying link, please wait...</p>
      </div>
    );
  }

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

export default MagicResetPage;
