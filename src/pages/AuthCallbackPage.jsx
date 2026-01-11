import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('OAuth error:', error)
        navigate('/signin')
        return
      }

      if (data?.session) {
        navigate('/home') // or dashboard
      } else {
        navigate('/signin')
      }
    }

    handleAuth()
  }, [navigate])

  return <p>Signing you in...</p>
}

export default AuthCallback
