import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Shield } from 'lucide-react';
import api from '../config/api'; // ← import the configured axios instance

const OtpLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inputRefs = useRef([]);

  useEffect(() => {
    if (step === 'otp' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  const sendOtp = async () => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/api/auth/otp/send', { email });

      setSuccess('8-digit OTP sent to your email');
      setStep('otp');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to send OTP. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 8) {
      setError('Please enter all 8 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await api.post('/api/auth/otp/verify', {
        email,
        token: otpCode,
      });

      localStorage.setItem('access_token', data.token);

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/home'), 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Invalid or expired OTP. Please try again.'
      );
      setOtp(['', '', '', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 7) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter' && otp.every(digit => digit !== '')) {
      verifyOtp();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 8);

    if (!pasted) return;

    const newOtp = Array(8).fill('');
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const nextIndex = pasted.length < 8 ? pasted.length : 7;
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '', '', '']);
    setStep('email');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
            {step === 'email' ? (
              <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            ) : (
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {step === 'email' ? 'Welcome Back' : 'Verify Your Email'}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 px-2">
            {step === 'email'
              ? 'Enter your email to receive a one-time password'
              : `Code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center text-sm sm:text-base">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center text-sm sm:text-base">
            {success}
          </div>
        )}

        {step === 'email' ? (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                onKeyDown={(e) => e.key === 'Enter' && !loading && sendOtp()}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-50 text-base sm:text-lg"
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={loading || !email.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setStep('email')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Change email
            </button>

            <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  className="w-9 h-12 sm:w-11 sm:h-14 md:w-12 md:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-50"
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading || otp.some(d => !d)}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <div className="text-center text-sm">
              <p className="text-gray-600 mb-1.5">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Secure authentication • OTP based
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpLogin;