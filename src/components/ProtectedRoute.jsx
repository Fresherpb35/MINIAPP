// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../config/supabase'

export default function ProtectedRoute() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for changes (critical for OAuth timing)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[ProtectedRoute] Auth event:', event, session ? 'YES' : 'NO')
      setSession(session)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Verifying session...</h2>
        <p>Please wait a moment</p>
      </div>
    )
  }

  if (!session?.user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}