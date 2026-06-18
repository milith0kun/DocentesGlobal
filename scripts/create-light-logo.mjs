import sharp from 'sharp';

async function createLightVersion() {
  const inputPath = 'public/assets/cgb-logo.png';
  const outputPath = 'public/assets/cgb-logo-light.png';
  
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    if (a < 10) continue; // skip transparent
    
    // Detect dark navy blue pixels (#0a2240 range) → make them white
    if (r < 60 && g < 70 && b < 90) {
      data[i] = 255;     // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
    }
    // Teal/turquoise pixels (#2bb5b0 range) → keep them but brighten slightly
    else if (g > 140 && b > 140 && r < 120) {
      data[i] = Math.min(255, r + 40);
      data[i + 1] = Math.min(255, g + 30);
      data[i + 2] = Math.min(255, b + 30);
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
  
  console.log('Light version saved to', outputPath);
}

createLightVersion().catch(console.error);
