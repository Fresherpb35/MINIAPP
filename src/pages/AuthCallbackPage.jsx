// src/pages/AuthCallbackPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Processing login...')

  useEffect(() => {
    let mounted = true

    const handleCallback = async () => {
      try {
        // Quick check (sometimes already finished)
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          if (mounted) {
            setStatus('Success! Redirecting...')
            navigate('/home', { replace: true })
          }
          return
        }

        // Wait for real auth state change (most important part for OAuth)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('[Callback] Event:', event, session ? 'YES' : 'NO')

          if (session?.user) {
            if (mounted) {
              setStatus('Authenticated! Redirecting...')
              navigate('/home', { replace: true })
            }
          }
        })

        return () => subscription.unsubscribe()
      } catch (err) {
        console.error('Callback error:', err)
        if (mounted) {
          setStatus('Error – redirecting...')
          setTimeout(() => navigate('/', { replace: true }), 2000)
        }
      }
    }

    handleCallback()

    // Safety timeout
    const timeout = setTimeout(() => {
      if (mounted) navigate('/', { replace: true })
    }, 12000)

    return () => {
      mounted = false
      clearTimeout(timeout)
    }
  }, [navigate])

  return (
    <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h2>{status}</h2>
      <p>Please wait 2–6 seconds – do not refresh or close</p>
    </div>
  )
}