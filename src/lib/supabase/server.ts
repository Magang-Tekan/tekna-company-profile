import { createClient } from '@supabase/supabase-js'
import { getSupabaseUrl, getSupabaseServiceRoleKey } from './config'

export const supabaseAdmin = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
