import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const handleAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.user) {
          console.error('No valid session found');
          return navigate('/signin', { replace: true });
        }

        // Store tokens (if your app still needs them)
        localStorage.setItem('access_token', session.access_token);
        localStorage.setItem('refresh_token', session.refresh_token);

        // Check existing user record
        const { data: userRecord, error: fetchError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (fetchError) {
          console.error('Error checking user record:', fetchError);
        }

        let currentRole = userRecord?.role;

        // If no record exists OR role is missing/default → assign pending role
        if (!userRecord || !currentRole || currentRole === 'user') {
          const pendingRole = localStorage.getItem('pending_role');

          if (pendingRole && ['user', 'developer'].includes(pendingRole)) {
            const { error: upsertError } = await supabase
              .from('users')
              .upsert(
                {
                  id: session.user.id,
                  role: pendingRole,
                  email: session.user.email ?? undefined,
                  name:
                    session.user.user_metadata?.full_name ||
                    session.user.user_metadata?.name ||
                    session.user.email?.split('@')[0] ||
                    undefined,
                  // avatar_url: session.user.user_metadata?.avatar_url,
                  // status: 'active', etc. — add if needed
                },
                { onConflict: 'id' }
              );

            if (upsertError) {
              console.error('Failed to save role:', upsertError.message);
            } else {
              currentRole = pendingRole;
              console.log(`Assigned role: ${pendingRole}`);
            }

            // Clean up
            localStorage.removeItem('pending_role');
          }
        }

        // Final redirect
        navigate('/home', { replace: true });
      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/signin', { replace: true });
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium">Completing sign in...</p>
    </div>
  );
};

export default AuthCallbackPage;