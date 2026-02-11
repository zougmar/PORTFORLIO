// Script to prepare backend files for Vercel deployment
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const apiDir = path.join(rootDir, 'api');

// Copy backend files to api directory
function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      // Skip node_modules and uploads
      if (childItemName === 'node_modules' || childItemName === 'uploads' || childItemName === 'package-lock.json') {
        return;
      }
      copyRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('📦 Preparing backend files for Vercel...');

// Copy backend structure to api/backend
const apiBackendDir = path.join(apiDir, 'backend');
if (fs.existsSync(apiBackendDir)) {
  fs.rmSync(apiBackendDir, { recursive: true, force: true });
}
copyRecursive(backendDir, apiBackendDir);

console.log('✅ Backend files copied to api/backend');
