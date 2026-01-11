import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error('OAuth session missing', error);
        navigate('/signin', { replace: true });
        return;
      }

      // OPTIONAL: sync user with backend
      await fetch('https://mini-app-b249.onrender.com/api/auth/me', {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });

      navigate('/home', { replace: true });
    };

    finishLogin();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Completing Google login...
    </div>
  );
}
