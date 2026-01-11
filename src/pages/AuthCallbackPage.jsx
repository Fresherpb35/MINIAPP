// src/pages/AuthCallbackPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Supabase v2 automatically stores session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('OAuth failed:', error);
        navigate('/signin', { replace: true });
        return;
      }

      console.log('OAuth success:', session.user.email);

      // OPTIONAL: send token to backend
      await fetch('https://mini-app-b249.onrender.com/api/protected', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      navigate('/home', { replace: true });
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Completing login...
    </div>
  );
}
