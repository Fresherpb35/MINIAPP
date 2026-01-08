// src/pages/LoginViaOTPPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../config/api'; // Axios instance

const LoginViaOTPPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // Validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await api.post('/api/auth/otp/send', { email: email.trim() });

      if (data.success) {
        setSuccess('OTP sent successfully! Check your email.');
        setEmail('');
        // Optional: Navigate to OTP verification page
        // setTimeout(() => navigate('/verify-otp', { state: { email } }), 1500);
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('OTP send error:', err);
      const msg = err.response?.data?.message || 'Network error. Please check your connection and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/signin')}
          className="p-2 -ml-2 hover:bg-blue-700 rounded-full transition-colors"
          aria-label="Back to sign in"
        >
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-2xl font-semibold">Login with OTP</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-md mx-auto w-full mt-12">
        <p className="text-gray-600 text-center mb-8">
          Enter your email address and we'll send you a one-time password (OTP) to log in securely.
        </p>

        {/* Error / Success Messages */}
        {error && (
          <div
            role="alert"
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-center"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="alert"
            className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center"
          >
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="email"
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>

        {/* Back link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/signin')}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginViaOTPPage;
