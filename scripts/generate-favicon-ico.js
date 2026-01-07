const sharp = require('sharp');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const iconPath = path.join(publicDir, 'icon-32.png');

async function generateFaviconIco() {
  try {
    console.log('Generating favicon.ico...');
    
    // Read the 32x32 PNG
    const buffer = await sharp(iconPath)
      .resize(32, 32)
      .toBuffer();
    
    // Since sharp can't create .ico directly, we'll just copy the 32x32 PNG as a fallback
    // Most modern browsers support PNG favicons anyway
    const fs = require('fs');
    fs.copyFileSync(iconPath, path.join(publicDir, 'favicon.ico'));
    
    console.log('✅ Generated favicon.ico');
  } catch (error) {
    console.error('❌ Error generating favicon.ico:', error);
    process.exit(1);
  }
}

generateFaviconIco();
