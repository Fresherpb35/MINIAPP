import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function ProtectedRoute() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen (catches delayed OAuth session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sess) => {
      console.log('Protected →', event, sess ? 'YES' : 'no');
      setSession(sess);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Checking login...</div>;

  if (!session?.user) return <Navigate to="/" replace />;

  return <Outlet />;
}