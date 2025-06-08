const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const inputSvg = path.join(__dirname, '../public/Pheme_wave.svg');
  const publicDir = path.join(__dirname, '../public');

  // Generate multi-resolution favicon.ico
  const sizes = [16, 32, 48, 64, 128, 256];
  const pngBuffers = await Promise.all(
    sizes.map(size =>
      sharp(inputSvg)
        .resize(size, size)
        .png()
        .toBuffer()
    )
  );
  await sharp({
    create: {
      width: 256,
      height: 256,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .png()
    .composite(pngBuffers.map((buf, i) => ({ input: buf, top: 0, left: 0 })))
    .toFile(path.join(publicDir, 'favicon.ico'));

  // Generate apple-touch-icon.png (180x180)
  await sharp(inputSvg)
    .resize(180, 180)
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
}

generateFavicons().catch(console.error); 