// src/pages/SignInPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../config/api';

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      const data = response.data;

      setSuccess('Login successful! Redirecting...');

      if (data.session?.access_token) {
        localStorage.setItem('access_token', data.session.access_token);
        localStorage.setItem('refresh_token', data.session.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        console.log('Access Token:', data.session.access_token);
        console.log('Refresh Token:', data.session.refresh_token);
        console.log('User Info:', data.user);
      }

      setEmail('');
      setPassword('');
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Sign In</h1>
          <p className="text-gray-600">Hi! Welcome back</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <div className="text-right">
            <button
              onClick={() => navigate('/forgot-password')}
              className="font-semibold text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer" // ← added
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>

        <div className="text-center mt-6">
          <p>
            Don’t have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-500 font-semibold hover:underline cursor-pointer" // ← added
            >
              Sign Up
            </button>
          </p>

          <button
            onClick={() => navigate('/otp-login')}
            className="mt-3 underline font-semibold text-blue-600 hover:text-blue-800 cursor-pointer" // ← added
          >
            Login via OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;