const sharp = require('sharp');
const path = require('path');

async function optimizeLogo() {
  const inputPath = path.join(__dirname, '../public/logos/optimism.png');
  const outputPath = path.join(__dirname, '../public/logos/optimism.png');

  await sharp(inputPath)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: 'lanczos3',
      withoutEnlargement: true
    })
    .png({ 
      quality: 100,
      compressionLevel: 9,
      adaptiveFiltering: true,
      force: true
    })
    .toFile(outputPath + '.tmp');

  // Replace the original file
  require('fs').renameSync(outputPath + '.tmp', outputPath);
}

optimizeLogo().catch(console.error); 