import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL!
// need service role key to bypass RLS, but we only have anon key in .env.local
// wait, the user is developing locally, maybe they don't have the service role key?
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data: profiles, error } = await supabase.from('profiles').select('*')
  console.log('Profiles:', profiles, error)
}
run()
