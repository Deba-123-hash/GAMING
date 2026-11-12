import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const MIGRATIONS_DIR = path.join(process.cwd(), 'database', 'migrations');
const FORBIDDEN = /\b(DROP\s+TABLE|TRUNCATE\s+TABLE)\b/i;

function main() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.error('[ERROR] Missing database/migrations directory.');
    process.exit(1);
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.error('[ERROR] No SQL migration files found.');
    process.exit(1);
  }

  for (const file of files) {
    const content = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    if (FORBIDDEN.test(content)) {
      console.error(`[ERROR] Destructive statement blocked in migration ${file}`);
      process.exit(1);
    }
    const sha = crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
    console.log(`[OK] Verified migration ${file} (sha256:${sha}..., ${content.length} bytes)`);
  }

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  if (!hasSupabase) {
    console.log(
      '[INFO] Live database connection not configured (.env.local / service key unset). Dry-run verification complete.'
    );
  } else {
    console.log(
      '[INFO] Supabase project detected. Apply verified migrations via Supabase SQL Editor or `supabase db push`.'
    );
  }
}

main();
