import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gqcwzxnuawpfqvrukcmn.supabase.co";
const supabaseAnonKey = "sb_publishable_0iw1rx1clTMefSjTERSH0w_5E-JQdL1";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Use placeholders only if not configured to prevent crash, but we'll check isSupabaseConfigured before use
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
