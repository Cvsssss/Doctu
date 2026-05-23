const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan SUPABASE_URL o SUPABASE_KEY en el archivo .env");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'operaciones'
  }
});

module.exports = supabase;
