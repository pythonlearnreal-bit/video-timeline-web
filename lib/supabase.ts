import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oixlnegxnfrixhsiekej.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peGxuZWd4bmZyaXhoc2lla2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxNTMzNTEsImV4cCI6MjExMDcyOTM1MX0.RRg-c51vZ9w6JgmndpPeZTyXDoDiKntHQSB0SUJTgXg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For agent uploads (use service role)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
