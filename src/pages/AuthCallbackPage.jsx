import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Completing login...');

  useEffect(() => {
    let mounted = true;

    const processLogin = async () => {
      try {
        // Try immediate session (sometimes already set)
        let { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          // Wait for auth state change (PKCE exchange happens async)
          await new Promise((resolve) => {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sess) => {
              console.log('Callback event:', event, sess ? 'YES' : 'NO');
              if (sess?.user) {
                session = sess;
                resolve();
              }
            });

            // Cleanup on unmount
            return () => subscription.unsubscribe();
          });
        }

        if (session?.user) {
          if (mounted) {
            setStatus('Success! Redirecting...');
            navigate('/home', { replace: true });
          }
        } else {
          throw new Error('No session after wait');
        }
      } catch (err) {
        console.error('Callback error:', err);
        setStatus('Error – redirecting to signup');
        setTimeout(() => navigate('/signup', { replace: true }), 2000);
      }
    };

    processLogin();

    // Timeout safety
    const timeout = setTimeout(() => {
      if (mounted) navigate('/signup', { replace: true });
    }, 15000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow max-w-md">
        <h2 className="text-2xl font-bold mb-4">{status}</h2>
        <p className="text-gray-600">Please wait 3–8 seconds – do not refresh</p>
      </div>
    </div>
  );
}