// src/pages/AuthCallbackPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true;

    const recoverSession = async () => {
      try {
        console.log('[Callback] Attempting session recovery...');

        // 1. Immediately recover session from URL fragment (this is the key)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session) {
          console.log('[Callback] Session recovered successfully:', session.user?.email);
          if (isMounted) {
            setStatus('success');
            setTimeout(() => navigate('/home', { replace: true }), 1000);
          }
          return;
        }

        console.log('[Callback] No session yet — starting listener');

        // 2. Fallback: listen for session if it arrives slightly later
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, newSession) => {
          if (newSession && isMounted) {
            console.log('[Callback] Session via listener:', newSession.user?.email);
            setStatus('success');
            setTimeout(() => navigate('/home', { replace: true }), 1000);
          }
        });

        // 3. Last safety net: force refresh
        await supabase.auth.refreshSession();

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('[Callback] Critical error:', err);
        if (isMounted) {
          setStatus('error');
          setTimeout(() => navigate('/signin', { replace: true }), 3000);
        }
      }
    };

    recoverSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      {status === 'loading' && (
        <div className="space-y-6">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-800">Finalizing Google login...</h2>
          <p className="text-gray-600">Please wait a moment</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6">
          <div className="text-7xl animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-green-700">Welcome!</h2>
          <p className="text-gray-600">Redirecting you to home...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-6 max-w-md">
          <div className="text-7xl">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600">Login failed</h2>
          <p className="text-gray-700 mb-6">
            We couldn't complete authentication. Please try again.
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
          >
            Back to Sign In
          </button>
        </div>
      )}
    </div>
  );
}