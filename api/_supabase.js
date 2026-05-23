const { createClient } = require('@supabase/supabase-js');

// Server-side: always use service role key to bypass RLS and schema cache limits.
// REACT_APP_SUPABASE_ANON_KEY is for client-side browser use only.
module.exports = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
