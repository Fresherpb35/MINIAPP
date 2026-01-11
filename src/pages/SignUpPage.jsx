import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SocialButton from '../components/ui/SocialButton';
import api from '../config/api';
import { supabase } from '../config/supabase';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      // Always use the current origin to ensure it matches Supabase settings
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      console.log('🔐 Starting OAuth with redirect:', redirectUrl);
      console.log('🌐 Current origin:', window.location.origin);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      console.log('📤 OAuth response:', { data, error });

      if (error) {
        console.error('OAuth error details:', error);
        throw error;
      }
      
      // OAuth will redirect automatically
    } catch (err) {
      console.error('❌ Google sign-in error:', err);
      setError(err.message || 'Failed to start Google sign-in.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!agreed) {
      setError('You must agree to the terms and conditions');
      return;
    }

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      setSuccess('Registration successful! Redirecting to sign in...');
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');

      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Account</h1>
          <p className="text-gray-600">Join now and get started</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center">
            {success}
          </div>
        )}

        <div className="space-y-5">
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading || googleLoading}
          />

          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || googleLoading}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || googleLoading}
          />

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading || googleLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base appearance-none cursor-pointer"
            >
              <option value="user">User</option>
              <option value="developer">Developer</option>
            </select>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={loading || googleLoading}
              className="w-5 h-5 mt-1 accent-blue-600 cursor-pointer"
            />
            <label className="text-sm text-gray-600">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
                Terms & Conditions
              </a>
            </label>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || googleLoading}
            className="w-full py-3"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing Up...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <SocialButton
            icon={
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
            }
            onClick={handleGoogleSignUp}
            disabled={loading || googleLoading}
            className="w-full max-w-xs"
          >
            {googleLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              'Continue with Google'
            )}
          </SocialButton>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/signin')}
              className="text-blue-600 font-semibold hover:underline"
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