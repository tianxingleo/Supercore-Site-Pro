import { createClient } from '@supabase/supabase-js'

async function check() {
  const url = process.env.SUPABASE_URL || 'http://localhost:8000'; // Need to be replaced or run via nuxt context
  // Better to use a nitro server script that we can call
}
