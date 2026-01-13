// pages/AuthCallbackPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState('Processing Google login...');

  useEffect(() => {
    let mounted = true;

    // Quick check first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && mounted) {
        setMsg('Success!');
        navigate('/home', { replace: true });
      }
    });

    // The important part: wait for the event that fires AFTER code exchange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Callback → Event:', event, session ? 'YES' : 'no');

      if (session?.user) {
        if (mounted) {
          setMsg('Logged in! Redirecting...');
          navigate('/home', { replace: true });
        }
      }
    });

    // Safety timeout
    const timeout = setTimeout(() => {
      if (mounted) navigate('/', { replace: true });
    }, 10000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div style={{ padding: '80px 20px', textAlign: 'center' }}>
      <h2>{msg}</h2>
      <p>Wait 2–5 seconds, do not refresh</p>
    </div>
  );
}