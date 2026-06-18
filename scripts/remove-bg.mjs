import sharp from 'sharp';

async function processImage() {
  const input = 'WhatsApp Image 2026-06-17 at 6.05.56 PM.jpeg';
  const outputColor = 'public/assets/logobiomedic.png';
  const outputWhite = 'public/assets/biomedic-logo-white.png';
  
  try {
    // We first extract the metadata to know the width and height
    const metadata = await sharp(input).metadata();
    const width = metadata.width;
    const height = metadata.height;

    // Crop 20 pixels from all edges to remove any screenshot UI lines
    const cropMargin = 20;
    const croppedBuffer = await sharp(input)
      .extract({ 
        left: cropMargin, 
        top: cropMargin, 
        width: width - cropMargin * 2, 
        height: height - cropMargin * 2 
      })
      .toBuffer();

    // 1. Color version with transparent background
    let { data: colorData, info: colorInfo } = await sharp(croppedBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < colorData.length; i += colorInfo.channels) {
      const r = colorData[i];
      const g = colorData[i + 1];
      const b = colorData[i + 2];
      
      // If pixel is close to white, make it transparent
      if (r > 200 && g > 200 && b > 200) {
        colorData[i + 3] = 0; // alpha
      }
    }

    const colorBuffer = await sharp(colorData, {
      raw: {
        width: colorInfo.width,
        height: colorInfo.height,
        channels: colorInfo.channels
      }
    })
    .trim()
    .png()
    .toBuffer();

    await sharp(colorBuffer).toFile(outputColor);
    console.log("Color image processed, cropped, trimmed, and saved.");

    // 2. White version with transparent background
    let { data: whiteData, info: whiteInfo } = await sharp(croppedBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < whiteData.length; i += whiteInfo.channels) {
      const r = whiteData[i];
      const g = whiteData[i + 1];
      const b = whiteData[i + 2];
      
      if (r > 200 && g > 200 && b > 200) {
        whiteData[i + 3] = 0; // alpha transparent
      } else {
        // Change colored pixels to white
        whiteData[i] = 255;
        whiteData[i + 1] = 255;
        whiteData[i + 2] = 255;
      }
    }

    const whiteBuffer = await sharp(whiteData, {
      raw: {
        width: whiteInfo.width,
        height: whiteInfo.height,
        channels: whiteInfo.channels
      }
    })
    .trim()
    .png()
    .toBuffer();

    await sharp(whiteBuffer).toFile(outputWhite);
    console.log("White image processed, cropped, trimmed, and saved.");

  } catch (err) {
    console.error(err);
  }
}

processImage();
