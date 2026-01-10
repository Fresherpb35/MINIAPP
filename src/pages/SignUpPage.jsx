// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SocialButton from '../components/ui/SocialButton';
import api from '../config/api'; // Use axios instance
import { supabase } from '../config/supabase'; // ✅ ADD THIS


const SignUpPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to lowercase
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  
  // 🔐 GOOGLE SIGN UP
  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
redirectTo: import.meta.env.PROD 
  ? 'https://miniapp-six-wine.vercel.app/auth/callback'
  : `${window.location.origin}/auth/callback`      },
    });

    if (error) {
      console.error(error);
      setError('Google sign in failed');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!agreed) {
      setError('You must agree to the terms and conditions');
      return;
    }

    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password,
        role, // "user", "admin", "doctor"
      });

      setSuccess('Registration successful! Redirecting to sign in...');

      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');

      setTimeout(() => {
        navigate('/signin');
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);

      // Axios errors: response from server
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Registration failed. Please try again.');
      } else {
        setError('Unable to connect to server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Your Account</h1>
          <p className="text-gray-600 text-base">Join now and unlock your personalized pregnancy companion</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-2xl">
            {success}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          
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

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1 ml-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base appearance-none bg-white cursor-pointer"
            >
              <option value="user">User</option>
              <option value="developer">Developer

              </option>
            </select>
            <div className="absolute right-4 top-[52px] pointer-events-none">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-purple-600 cursor-pointer"
              disabled={loading}
            />
            <label className="text-gray-700 text-base">
              Agree with{' '}
              <span className="text-red-400">term & condition</span>
            </label>
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-600 text-base font-medium">Sign Up</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <SocialButton
            icon={<img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />}
            onClick={handleGoogleSignUp}   // ✅ FIXED
            disablsed={loading}
          />
        
        </div>

        <div className="text-center">
          <p className="text-gray-700 text-base">
            You have an account?{' '}
            <button
              onClick={() => navigate('/signin')}
              className="text-blue-500 font-semibold hover:text-blue-600 cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
