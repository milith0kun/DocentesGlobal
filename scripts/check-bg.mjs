import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const firstFrame = path.join(__dirname, '..', 'public', 'frames', 'hero-institucional', 'frame_0001.webp');

async function checkBg() {
  const image = sharp(firstFrame);
  const metadata = await image.metadata();
  console.log('Image dimensions:', metadata.width, 'x', metadata.height);

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  // Top left pixel (0,0)
  const r = data[0];
  const g = data[1];
  const b = data[2];
  console.log('Top left pixel RGB:', r, g, b);
}

checkBg();
