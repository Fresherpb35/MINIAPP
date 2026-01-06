// src/pages/SignInPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SocialButton from '../components/ui/SocialButton';

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
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login successful! Redirecting...');

        // Save access token & user info
        if (data.session && data.session.access_token) {
          localStorage.setItem('access_token', data.session.access_token);
          localStorage.setItem('refresh_token', data.session.refresh_token);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          console.warn('No token found in response!', data);
        }

        // Reset form
        setEmail('');
        setPassword('');

        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error or server is unreachable. Check if backend is running on port 4000.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Sign in with ${provider} (coming soon)`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Sign In</h1>
          <p className="text-gray-600 text-base">Hy! Welcome back you have been missed</p>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-2xl">{success}</div>}

        <div className="space-y-4 mb-6">
          <Input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          <Input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />

          <div className="text-right">
            <button onClick={() => navigate('/forgot-password')} className="text-gray-900 font-semibold text-base hover:text-gray-700 cursor-pointer">
              Forgot Password?
            </button>
          </div>

          <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</Button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-600 text-base font-medium">Sign Up</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <SocialButton icon={<img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />} onClick={() => handleSocialLogin('Google')} />
          <SocialButton icon={<svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>} onClick={() => handleSocialLogin('Facebook')} />
          <SocialButton icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>} onClick={() => handleSocialLogin('Apple')} />
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-700 text-base">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-blue-500 font-semibold hover:text-blue-600 cursor-pointer">Sign Up</button>
          </p>
          <button onClick={() => navigate('/login-otp')} className="text-gray-900 font-bold text-base underline hover:text-gray-700 cursor-pointer">
            Login via OTP
          </button>
        </div>
      </div>
    </div>
  );
};    

export default SignInPage;