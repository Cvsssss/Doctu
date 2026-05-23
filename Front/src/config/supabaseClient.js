import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan REACT_APP_SUPABASE_URL o REACT_APP_SUPABASE_ANON_KEY en el .env del front");
}

// Exportamos la constante para poder importarla en el Login
export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'operaciones'
  }
});