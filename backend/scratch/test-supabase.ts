import { supabase } from '../src/services/supabase.service';

async function testSupabase() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Connection failed:', error.message);
  } else {
    console.log('Connection successful! Buckets found:', data.map(b => b.name));
  }
}

testSupabase();
