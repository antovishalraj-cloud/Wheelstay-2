const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  const { data, error } = await supabase.from('spaces').select(`
    *,
    owner:users (
      name,
      phone,
      email
    )
  `);
  console.log(data, error);
}

test();
