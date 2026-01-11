import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import api from '../config/api';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          // User is authenticated with Supabase
          const user = session.user;
          
          // Send user data to your backend to create/update user record
          try {
            const response = await api.post('/api/auth/google-signin', {
              email: user.email,
              name: user.user_metadata?.full_name || user.email.split('@')[0],
              googleId: user.id,
              avatar: user.user_metadata?.avatar_url,
            });

            // Store token if your backend returns one
            if (response.data.token) {
              localStorage.setItem('token', response.data.token);
            }

            setStatus('Success! Redirecting...');
            setTimeout(() => {
              navigate('/dashboard');
            }, 1000);
          } catch (backendError) {
            console.error('Backend error:', backendError);
            setStatus('Authentication successful, but failed to sync with server.');
            setTimeout(() => {
              navigate('/signin');
            }, 2000);
          }
        } else {
          throw new Error('No session found');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('Authentication failed. Redirecting...');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authenticating</h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
};

export default AuthCallback;