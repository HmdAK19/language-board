import { spawnSync } from 'node:child_process';
import process from 'node:process';

const result = spawnSync(
  process.execPath,
  ['node_modules/@playwright/test/cli.js', 'test', 'e2e/documentation.spec.ts'],
  {
    stdio: 'inherit',
    env: { ...process.env, UPDATE_DOC_SCREENSHOTS: '1' },
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
