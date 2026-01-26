import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Category icon mappings based on image IDs and typical usage
// We'll map numeric IDs to descriptive names
const mappings = {
  '50866984.png': 'general-compute.png',
  '50866986.png': 'storage.png',
  '50866987.png': 'hpc.png',
  '50866988.png': 'network.png',
  '50866989.png': 'ethernet-switch.png',
  '50866990.png': 'ib-switch.png',
};

const sourceDir = path.join(__dirname, '../public/images/categories');

console.log('Renaming category icons...\n');

Object.entries(mappings).forEach(([oldName, newName]) => {
  const oldPath = path.join(sourceDir, oldName);
  const newPath = path.join(sourceDir, newName);

  if (fs.existsSync(oldPath)) {
    // If the target already exists, remove it first
    if (fs.existsSync(newPath)) {
      fs.unlinkSync(newPath);
      console.log(`Removed existing: ${newName}`);
    }

    fs.copyFileSync(oldPath, newPath);
    console.log(`✓ Copied ${oldName} -> ${newName}`);
  } else {
    console.log(`✗ Source not found: ${oldName}`);
  }
});

console.log('\nDone! Category icons are now available with descriptive names.');
