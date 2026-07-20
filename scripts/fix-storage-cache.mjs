/**
 * One-time script: re-upload existing Supabase Storage objects
 * with a long Cache-Control (1 year) for better PageSpeed scores.
 *
 * Usage (from repo root):
 *   node --env-file=.env.local scripts/fix-storage-cache.mjs
 *
 * Requires:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.STORAGE_BUCKET || 'uploads';
const CACHE_CONTROL = '31536000'; // 1 year
const PAGE_SIZE = 100;

if (!supabaseUrl || !serviceKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function listAllFiles(prefix = '') {
  const files = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit: PAGE_SIZE,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) throw error;
    if (!data?.length) break;

    for (const item of data) {
      // Folders have id === null in some API versions; skip empty names
      if (!item.name) continue;

      const path = prefix ? `${prefix}/${item.name}` : item.name;

      // Heuristic: folders usually have metadata null and no size
      if (item.id === null && !item.metadata) {
        const nested = await listAllFiles(path);
        files.push(...nested);
      } else {
        files.push(path);
      }
    }

    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return files;
}

async function fixFile(path) {
  const { data: blob, error: downloadError } = await supabase.storage
    .from(BUCKET)
    .download(path);

  if (downloadError) {
    throw downloadError;
  }

  const buffer = Buffer.from(await blob.arrayBuffer());
  const contentType = blob.type || 'application/octet-stream';

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      cacheControl: CACHE_CONTROL,
      contentType,
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }
}

async function main() {
  console.log(`Listing files in bucket "${BUCKET}"...`);
  const files = await listAllFiles();
  console.log(`Found ${files.length} files. Updating cacheControl → ${CACHE_CONTROL}`);

  let ok = 0;
  let failed = 0;

  for (const path of files) {
    try {
      process.stdout.write(`  fixing ${path} ... `);
      await fixFile(path);
      console.log('ok');
      ok += 1;
    } catch (err) {
      console.log('FAIL');
      console.error(`    ${err.message || err}`);
      failed += 1;
    }
  }

  console.log(`\nDone. Updated: ${ok}, Failed: ${failed}`);
  console.log(
    'CDN may take up to ~1 minute to propagate. Re-run PageSpeed after that.'
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
