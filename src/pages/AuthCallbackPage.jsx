import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // This will automatically detect session from URL if detectSessionInUrl=true
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (session) {
          navigate('/home') // login successful
        } else {
          navigate('/signin') // no session
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
