import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;



export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export const uploadFile = async (buffer: Buffer, filename: string, contentType: string) => {
  const bucketName = 'statements';
  
  // Ensure bucket exists
  const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
  if (getBucketsError) {
    // Continue anyway, maybe we can upload even if we can't list
  } else {
    const bucketExists = buckets.find(b => b.name === bucketName);
    if (!bucketExists) {

      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: false,
      });
      if (createError) {

        throw new Error(`Bucket '${bucketName}' does not exist and could not be created: ${createError.message}`);
      }
    }
  }

  // Create a unique path for the file
  const timestamp = Date.now();
  const path = `${timestamp}_${filename}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error('[SupabaseService] Upload Error Detail:', error);
    throw new Error(`Failed to upload file to Supabase: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);

  return {
    path: data.path,
    publicUrl,
  };
};
