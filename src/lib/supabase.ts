import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://odsujbhqocwypyjfwwvx.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseKey && supabaseKey !== 'paste_anon_key_di_sini'
);

export const supabase = createClient(supabaseUrl, supabaseKey || 'dummy-key');
