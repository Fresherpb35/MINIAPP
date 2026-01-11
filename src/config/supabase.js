// config/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Add console logs to debug
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)
console.log('Key length:', supabaseAnonKey?.length)
console.log('Key preview:', supabaseAnonKey?.substring(0, 50) + '...')
console.log('Key ends with:', '...' + supabaseAnonKey?.substring(supabaseAnonKey.length - 20))

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // 🔥 THIS FIXES EVERYTHING
  },
})
