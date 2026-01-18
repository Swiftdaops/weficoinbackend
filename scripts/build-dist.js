import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const distDir = path.join(projectRoot, 'dist');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function rmDir(dir) {
  if (await exists(dir)) {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const fromPath = path.join(from, entry.name);
      const toPath = path.join(to, entry.name);

      if (entry.isDirectory()) {
        await copyDir(fromPath, toPath);
        return;
      }

      if (entry.isFile()) {
        await fs.copyFile(fromPath, toPath);
      }
    })
  );
}

try {
  await rmDir(distDir);
  await copyDir(srcDir, distDir);
  console.log('Built dist/ by copying src/.');
} catch (err) {
  console.error('Failed to build dist/.', err);
  process.exitCode = 1;
}
