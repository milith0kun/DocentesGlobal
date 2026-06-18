import sharp from 'sharp';
import fs from 'fs';

async function removeWhiteBackground() {
  const inputPath = 'WhatsApp Image 2026-06-17 at 6.32.29 PM.jpeg';
  const outputPath = 'public/assets/cgb-logo.png';
  
  // Use sharp to make white pixels transparent
  // We'll add an alpha channel and manipulate the raw pixel data
  
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // If pixel is close to white, make it transparent
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0; // alpha = 0
    } else if (r > 200 && g > 200 && b > 200) {
       // Anti-aliasing edge softening
       const distanceToWhite = ((255 - r) + (255 - g) + (255 - b)) / 3;
       data[i + 3] = Math.floor(distanceToWhite * 4.5); // Partial transparency
    }
  }
  
  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    }
  })
  .png()
  .toFile(outputPath);
  
  console.log('Background removed and saved to', outputPath);
}

removeWhiteBackground().catch(console.error);
