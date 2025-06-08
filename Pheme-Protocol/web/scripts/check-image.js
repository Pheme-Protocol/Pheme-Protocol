const sharp = require('sharp');
const path = require('path');

async function checkImage() {
  const inputPath = path.join(__dirname, '../public/logos/optimism.png');
  const metadata = await sharp(inputPath).metadata();
  console.log('Image metadata:', metadata);
}

checkImage().catch(console.error); 