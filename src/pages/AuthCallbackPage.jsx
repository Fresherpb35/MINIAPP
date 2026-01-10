// src/pages/AuthCallbackPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 1. Force Supabase to parse the URL fragment and get the session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        if (session) {
          console.log('Session successfully recovered:', {
            user: session.user?.email,
            expires_at: session.expires_at,
          });

          setStatus('success');
          // Small delay gives nice UX transition
          setTimeout(() => {
            navigate('/home', { replace: true });
          }, 800);
          return;
        }

        // 2. If no session immediately — wait a moment and retry (edge case)
        console.log('No session found yet — retrying once...');
        await new Promise(resolve => setTimeout(resolve, 800));

        const retry = await supabase.auth.getSession();
        if (retry.data.session) {
          console.log('Session found on retry:', retry.data.session.user?.email);
          setStatus('success');
          setTimeout(() => navigate('/home', { replace: true }), 800);
          return;
        }

        // 3. Final fallback: give up and redirect to login
        console.warn('No session after retry — redirecting to sign in');
        setStatus('error');
        setTimeout(() => navigate('/signin', { replace: true }), 2000);

      } catch (err) {
        console.error('Auth callback failed:', err);
        setStatus('error');
        setTimeout(() => navigate('/signin', { replace: true }), 3000);
      }
    };

    handleCallback();

    // Optional: Also listen for future changes (safety net)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        console.log('Session detected via listener — redirecting');
        navigate('/home', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      {status === 'loading' && (
        <div className="space-y-6">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Completing authentication</h2>
            <p className="mt-3 text-gray-600">Please wait a moment...</p>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6">
          <div className="text-7xl">🎉</div>
          <h2 className="text-2xl font-bold text-green-700">Welcome back!</h2>
          <p className="text-gray-600">Redirecting to home...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-6 max-w-md">
          <div className="text-7xl">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600">Authentication failed</h2>
          <p className="text-gray-700">
            We couldn't complete the login process. Please try again.
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            Back to Sign In
          </button>
        </div>
      )}
    </div>
  );
}