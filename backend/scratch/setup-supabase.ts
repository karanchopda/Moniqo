import { supabase } from '../src/services/supabase.service';

async function setupSupabase() {
  const bucketName = 'statements';
  console.log(`Checking for bucket '${bucketName}'...`);
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('List failed:', listError.message);
    return;
  }

  const exists = buckets.find(b => b.name === bucketName);
  if (!exists) {
    console.log(`Creating bucket '${bucketName}'...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
    });
    if (error) {
      console.error('Create failed:', error.message);
    } else {
      console.log('Bucket created successfully!');
    }
  } else {
    console.log('Bucket already exists.');
  }
}

setupSupabase();
