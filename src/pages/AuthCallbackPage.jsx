// src/pages/AuthCallbackPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const recoverSession = async () => {
      try {
        // Parse session from URL hash
        const { data, error } = await supabase.auth.getSessionFromUrl({
          storeSession: true, // very important
        });

        if (error) throw error;
        if (!data?.session) throw new Error('No session returned');

        console.log('Session recovered:', data.session.user?.email);

        setStatus('success');

        // Optional: send token to backend
        const token = data.session.access_token;
        await fetch('https://mini-app-b249.onrender.com/api/protected', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTimeout(() => navigate('/home', { replace: true }), 1000);
      } catch (err) {
        console.error('Session recovery failed:', err);
        setStatus('error');
        setTimeout(() => navigate('/signin', { replace: true }), 3000);
      }
    };

    recoverSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      {status === 'loading' && <p>Completing login...</p>}
      {status === 'success' && <p>Login successful! Redirecting...</p>}
      {status === 'error' && <p>Login failed. Redirecting to signin...</p>}
    </div>
  );
}
