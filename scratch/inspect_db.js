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
  console.log('URL:', env.NEXT_PUBLIC_SUPABASE_URL);
  
  // 1. List auth users
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.error('Error listing auth users:', usersError);
  } else {
    console.log('Auth users count:', users.length);
    console.log('Auth users list:', users.map(u => ({ id: u.id, email: u.email, confirmed: !!u.email_confirmed_at })));
  }

  // 2. Try to query public.users
  const { data: publicUsers, error: publicUsersError } = await supabase.from('users').select('*').limit(5);
  console.log('public.users error:', publicUsersError ? publicUsersError.message : 'None');
  console.log('public.users data:', publicUsers);

  // 3. Try to query profiles
  const { data: publicProfiles, error: publicProfilesError } = await supabase.from('profiles').select('*').limit(5);
  console.log('public.profiles error:', publicProfilesError ? publicProfilesError.message : 'None');
  console.log('public.profiles data:', publicProfiles);
}

run();
