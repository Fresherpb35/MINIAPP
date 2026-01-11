import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../config/supabase';
import api from '../config/api';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Auth callback started');
        console.log('📍 Full URL:', window.location.href);
        console.log('📍 Search params:', window.location.search);

        // Check for error in URL params
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam) {
          console.error('❌ OAuth error:', errorParam, errorDescription);
          throw new Error(errorDescription || errorParam);
        }

        // Get the authorization code from URL
        const code = searchParams.get('code');
        
        if (!code) {
          console.error('❌ No authorization code found in URL');
          throw new Error('No authorization code received from Google');
        }

        console.log('✅ Found authorization code, exchanging for session...');
        setStatus('Exchanging authorization code...');
        
        // Exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('❌ Code exchange error:', exchangeError);
          throw exchangeError;
        }
        
        if (!data?.session) {
          console.error('❌ No session returned from code exchange');
          throw new Error('Failed to establish session');
        }

        console.log('✅ Session obtained successfully');
        console.log('👤 User:', data.session.user.email);
        
        await handleSuccessfulAuth(data.session);

      } catch (error) {
        console.error('❌ Auth callback error:', error);
        setError(error.message || 'Authentication failed');
        setStatus('Redirecting to sign in...');
        
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 2000);
      }
    };

    const handleSuccessfulAuth = async (session) => {
      try {
        setStatus('Syncing with server...');
        const user = session.user;

        // Send user data to your backend
        try {
          const response = await api.post('/api/auth/google-signin', {
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
            googleId: user.id,
            avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          });

          console.log('✅ Backend sync successful');

          // Store token if your backend returns one
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }

          setStatus('Success! Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);
        } catch (backendError) {
          console.error('⚠️ Backend sync error:', backendError);
          
          // Even if backend fails, user is authenticated with Supabase
          setStatus('Logged in! Redirecting...');
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1500);
        }
      } catch (err) {
        console.error('❌ Error in handleSuccessfulAuth:', err);
        throw err;
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {!error ? (
          <>
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authenticating</h2>
            <p className="text-gray-600">{status}</p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-red-600 mb-2">{error}</p>
            <p className="text-gray-600 text-sm">{status}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;