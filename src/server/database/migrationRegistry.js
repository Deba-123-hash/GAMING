import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const MIGRATIONS_DIR = path.join(process.cwd(), 'database', 'migrations');
const FORBIDDEN_DESTRUCTIVE_PATTERN = /\b(DROP\s+TABLE|TRUNCATE\s+TABLE)\b/i;

export function getMigrationManifest() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return {
      directoryExists: false,
      migrations: [],
      hasDestructiveStatements: false,
    };
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith('.sql'))
    .sort();

  let hasDestructiveStatements = false;
  const migrations = files.map((fileName) => {
    const fullPath = path.join(MIGRATIONS_DIR, fileName);
    const content = fs.readFileSync(fullPath, 'utf8');
    const checksum = crypto.createHash('sha256').update(content).digest('hex');
    const destructive = FORBIDDEN_DESTRUCTIVE_PATTERN.test(content);
    if (destructive) hasDestructiveStatements = true;

    return {
      version: fileName.replace(/\.sql$/, ''),
      fileName,
      checksum,
      bytes: Buffer.byteLength(content, 'utf8'),
      destructive,
    };
  });

  return {
    directoryExists: true,
    migrations,
    hasDestructiveStatements,
  };
}
