import { createClient } from '@supabase/supabase-js'
import { getSupabaseUrl, getSupabaseAnonKey } from './config'

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey())
