import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../config/api';

const LoginViaOTPPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = send otp, 2 = verify otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = () => {
    if (!email.trim()) return 'Please enter your email address';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    const emailError = validateEmail();
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await api.post('/api/auth/otp/send', { email });

      if (data.success) {
        setSuccess('OTP sent to your email');
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP & Login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await api.post('/api/auth/otp/verify', {
        email,
        token: otp
      });

      if (data.success) {
        localStorage.setItem('access_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        navigate('/home');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
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
          className="p-2 -ml-2 hover:bg-blue-700 rounded-full"
        >
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-2xl font-semibold">Login with OTP</h1>
      </div>

      <div className="flex-1 p-6 max-w-md mx-auto w-full mt-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center">
            {success}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              maxLength={6}
              required
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-blue-600 underline w-full text-center"
            >
              Change email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginViaOTPPage;
