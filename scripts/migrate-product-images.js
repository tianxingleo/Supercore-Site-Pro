import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = path.join(__dirname, 'boer_deep_mirror');
const DEST_DIR = path.join(__dirname, '../public/images/products');

// Get all productinfo directories
const productInfoDirs = fs.readdirSync(SOURCE_DIR)
  .filter(name => name.startsWith('productinfo_'))
  .map(name => path.join(SOURCE_DIR, name));

console.log(`Found ${productInfoDirs.length} product directories`);

// Process each product directory
productInfoDirs.forEach(dir => {
  const htmlPath = path.join(dir, 'index.html');
  const mediaPath = path.join(dir, 'media');

  // Skip if HTML or media doesn't exist
  if (!fs.existsSync(htmlPath) || !fs.existsSync(mediaPath)) {
    console.log(`Skipping ${dir} - missing HTML or media directory`);
    return;
  }

  // Read HTML to extract product model
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Extract product model from title (e.g., "BC120G3-博迩科技")
  const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/);
  let model = 'unknown';

  if (titleMatch) {
    const titleText = titleMatch[1];
    // Extract model like "BC120G3", "BS450G3", "BC440G3", etc.
    const modelMatch = titleText.match(/(?:BC|BS)\d+[A-Z]\d*/i);
    if (modelMatch) {
      model = modelMatch[0].toLowerCase();
    }
  }

  console.log(`Processing ${path.basename(dir)} -> model: ${model}`);

  // Get all PNG images in media directory (excluding logo and QR code)
  const images = fs.readdirSync(mediaPath)
    .filter(f => f.endsWith('.png') && f !== '49494000.png' && f !== '49507613.jpg');

  if (images.length === 0) {
    console.log(`  No product images found in ${mediaPath}`);
    return;
  }

  // Create product directory
  const productDir = path.join(DEST_DIR, model);
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
    console.log(`  Created directory: ${productDir}`);
  }

  // Copy and rename images
  const imageNames = ['main.png', 'front.png', 'back.png', 'detail.png', 'side.png', 'top.png'];

  images.forEach((img, index) => {
    const srcPath = path.join(mediaPath, img);
    const destName = imageNames[index] || `image-${index}.png`;
    const destPath = path.join(productDir, destName);

    fs.copyFileSync(srcPath, destPath);
    console.log(`  Copied ${img} -> ${model}/${destName}`);
  });

  console.log(`  Total: ${images.length} images\n`);
});

console.log('Migration complete!');
