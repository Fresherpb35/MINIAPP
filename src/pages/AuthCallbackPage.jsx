// src/pages/AuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Completing Google signup...');

  useEffect(() => {
    let mounted = true;

    const checkAndRedirect = async () => {
      try {
        // Quick check
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (mounted) {
            setStatus('Success! Redirecting...');
            navigate('/home', { replace: true }); // or '/profile' or wherever
          }
          return;
        }

        // Wait for the real event (this is the key fix for PKCE timing)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sess) => {
          console.log('AuthCallback event:', event, sess ? 'YES session' : 'NO');

          if (sess?.user) {
            if (mounted) {
              setStatus('Authenticated! Redirecting...');
              navigate('/home', { replace: true });
            }
          }
        });

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error(err);
        if (mounted) {
          setStatus('Error – going back to signup');
          setTimeout(() => navigate('/signup', { replace: true }), 2000);
        }
      }
    };

    checkAndRedirect();

    // Safety timeout
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
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
        <h2 className="text-2xl font-bold mb-4">{status}</h2>
        <p className="text-gray-600">Please wait 2–6 seconds – do not refresh</p>
      </div>
    </div>
  );
}