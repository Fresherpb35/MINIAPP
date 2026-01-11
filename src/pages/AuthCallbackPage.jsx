import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // This reads the OAuth code from the URL and creates a session
        const { data, error } = await supabase.auth.getSessionFromUrl()
        if (error) throw error

        if (data?.session) {
          navigate('/profile') // now profile works
        } else {
          navigate('/signin')
        }
      } catch (err) {
        console.error('OAuth callback error:', err)
        navigate('/signin')
      }
    }

    handleAuth()
  }, [navigate])

  return <p>Signing you in...</p>
}

export default AuthCallback
