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
        console.log('[Callback] Attempting immediate session recovery...');

        // Force session recovery from URL hash/fragment
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[Callback] getSession error:', error);
          throw error;
        }

        // Safety check: data might be number/status code in rare bugs
        if (typeof data === 'number') {
          console.warn('[Callback] Unexpected numeric response from getSession:', data);
          throw new Error('Invalid session response');
        }

        if (data?.session) {
          console.log('[Callback] Session recovered:', data.session.user?.email);
          setStatus('success');
          setTimeout(() => navigate('/home', { replace: true }), 1000);
          return;
        }

        // Fallback: wait & listen (rare timing issue)
        console.log('[Callback] No session yet — starting listener');
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            console.log('[Callback] Session via listener:', session.user?.email);
            setStatus('success');
            setTimeout(() => navigate('/home', { replace: true }), 1000);
          }
        });

        // Cleanup
        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('[Callback] Full recovery failed:', err);
        setStatus('error');
        setTimeout(() => navigate('/signin', { replace: true }), 3000);
      }
    };

    recoverSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      {status === 'loading' && (
        <div className="space-y-6">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-800">Completing login...</h2>
          <p className="text-gray-600">This may take a few seconds</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6">
          <div className="text-7xl">🎉</div>
          <h2 className="text-2xl font-bold text-green-700">Success!</h2>
          <p className="text-gray-600">Redirecting to home...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-6 max-w-md">
          <div className="text-7xl">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600">Login failed</h2>
          <p className="text-gray-700 mb-6">
            We couldn't verify your session. Please try again.
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Back to Sign In
          </button>
        </div>
      )}
    </div>
  );
}