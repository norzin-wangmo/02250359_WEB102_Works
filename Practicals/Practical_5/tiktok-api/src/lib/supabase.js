import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
} else {
  console.warn(
    "Supabase credentials missing (SUPABASE_URL / SUPABASE_SERVICE_KEY). Video uploads use local disk."
  );
}

export function isSupabaseConfigured() {
  return Boolean(supabase);
}

export default supabase;
