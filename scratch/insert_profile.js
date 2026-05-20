const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    env[match[1].trim()] = val;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const userId = '547d41bc-3b92-4828-b099-b5b53df144ec';
  
  // Try inserting a profile
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: 'nilanjans434@gmail.com',
      full_name: 'Nilanjan Saha',
      updated_at: new Date().toISOString()
    })
    .select();

  console.log('Insert Profile Error:', error ? error.message : 'None');
  console.log('Insert Profile Data:', data);
}

run();
