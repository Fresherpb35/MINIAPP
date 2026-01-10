import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const recoverSession = async () => {
      try {
        // Parse token from URL after Google OAuth redirect
        const { data, error } = await supabase.auth.getSessionFromUrl({
          storeSession: true, // important
        });

        if (error) throw error;
        if (!data?.session) throw new Error('No session returned');

        console.log('[Callback] Session recovered:', data.session.user?.email);

        setStatus('success');
        setTimeout(() => navigate('/home', { replace: true }), 1000);
      } catch (err) {
        console.error('[Callback] Session recovery failed:', err);
        setStatus('error');
        setTimeout(() => navigate('/signin', { replace: true }), 3000);
      }
    };

    recoverSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === 'loading' && <p>Loading...</p>}
      {status === 'success' && <p>Login successful! Redirecting...</p>}
      {status === 'error' && <p>Login failed. Redirecting to signin...</p>}
    </div>
  );
}
