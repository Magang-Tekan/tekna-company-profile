export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
}

export const validateSupabaseConfig = () => {
  const missingVars = []
  
  if (!supabaseConfig.url) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseConfig.anonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  if (!supabaseConfig.serviceRoleKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY')
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env.local file.'
    )
  }
  
  return true
}

export const getSupabaseUrl = () => {
  if (!supabaseConfig.url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined')
  }
  return supabaseConfig.url
}

export const getSupabaseAnonKey = () => {
  if (!supabaseConfig.anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined')
  }
  return supabaseConfig.anonKey
}

export const getSupabaseServiceRoleKey = () => {
  if (!supabaseConfig.serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined')
  }
  return supabaseConfig.serviceRoleKey
}
