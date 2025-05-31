const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const inputSvg = path.join(__dirname, '../public/Pheme_wave.svg');
  const publicDir = path.join(__dirname, '../public');

  // Generate favicon.ico (16x16, 32x32, 48x48)
  await sharp(inputSvg)
    .resize(32, 32)
    .toFile(path.join(publicDir, 'favicon.ico'));

  // Generate apple-touch-icon.png (180x180)
  await sharp(inputSvg)
    .resize(180, 180)
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
}

generateFavicons().catch(console.error); 