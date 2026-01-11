import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'
import api from '../config/api'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const finishLogin = async () => {
      try {
        // ✅ THIS handles hash tokens automatically
        const { data, error } = await supabase.auth.getSessionFromUrl({
          storeSession: true,
        })

        if (error) throw error
        if (!data?.session) throw new Error('No session')

        const user = data.session.user
        const accessToken = data.session.access_token

        // OPTIONAL: sync with backend
        await api.post(
          '/api/auth/google-signin',
          {
            email: user.email,
            name: user.user_metadata?.full_name,
            avatar: user.user_metadata?.picture,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        navigate('/dashboard', { replace: true })
      } catch (err) {
        console.error(err)
        navigate('/signin', { replace: true })
      }
    }

    finishLogin()
  }, [navigate])

  return <p>Signing you in...</p>
}
