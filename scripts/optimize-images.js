import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '../public/images');

const conversions = [
  { input: '03302837-DD6F-40B1-B790-7561FC11D262.PNG', output: 'lucid-moments.webp' },
  { input: 'Screenshot 2026-02-06 at 2.40.42 AM.png', output: 'hero-bg.webp' },
  { input: 'hq720.jpg', output: 'visual-narrative.webp' },
  { input: 'images.jpeg', output: 'sonic-frequencies.webp' }
];

async function optimizeImages() {
  console.log('Starting image optimization...');
  
  for (const { input, output } of conversions) {
    const inputPath = path.join(imagesDir, input);
    const outputPath = path.join(imagesDir, output);

    if (fs.existsSync(inputPath)) {
      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        console.log(`✅ Optimized: ${input} -> ${output}`);
      } catch (error) {
        console.error(`❌ Error optimizing ${input}:`, error);
      }
    } else {
      console.warn(`⚠️  Input file not found: ${input}`);
    }
  }
}

optimizeImages();
