import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const recoverSession = async () => {
      try {
        console.log('[AuthCallback] Parsing session from URL...');

        // 1️⃣ Attempt to parse session from URL (OAuth / magic link)
        const { data, error } = await supabase.auth.getSessionFromUrl({
          storeSession: true, // store session in browser
        });

        if (error) {
          console.error('[AuthCallback] getSessionFromUrl error:', error);
          throw error;
        }

        // 2️⃣ Ensure data.session exists
        if (!data?.session) {
          throw new Error('No session returned from OAuth callback');
        }

        console.log('[AuthCallback] Session recovered:', data.session.user?.email);

        // 3️⃣ Optional: You can access refresh_token & provider_token here if needed
        const accessToken = data.session.access_token;
        const refreshToken = data.session.refresh_token;
        const providerToken = data.session.provider_token; // e.g., Google

        console.log('[AuthCallback] Tokens:', {
          accessToken,
          refreshToken,
          providerToken,
        });

        // 4️⃣ Success UI
        setStatus('success');

        // 5️⃣ Navigate to home/dashboard
        setTimeout(() => navigate('/home', { replace: true }), 1000);
      } catch (err) {
        console.error('[AuthCallback] Session recovery failed:', err);
        setStatus('error');

        // Redirect back to signin after showing error
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
