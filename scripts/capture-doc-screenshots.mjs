import { spawnSync } from 'node:child_process';
import process from 'node:process';

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(
  command,
  ['playwright', 'test', 'e2e/documentation.spec.ts'],
  {
    stdio: 'inherit',
    env: { ...process.env, UPDATE_DOC_SCREENSHOTS: '1' },
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
