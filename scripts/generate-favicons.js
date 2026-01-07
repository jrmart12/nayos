const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'logo.png');

// Icon sizes to generate
const sizes = [16, 32, 48, 96, 192, 512];

async function generateFavicons() {
  try {
    console.log('Generating favicons from logo.png...');

    // First, trim the transparent space around the logo
    const logoBuffer = await sharp(logoPath)
      .trim()
      .toBuffer();

    // Generate PNG favicons with cover fit to fill the space
    for (const size of sizes) {
      await sharp(logoBuffer)
        .resize(size, size, { 
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(path.join(publicDir, `icon-${size}.png`));
      console.log(`✓ Generated icon-${size}.png`);
    }

    // Generate main icon.png (192x192)
    await sharp(logoBuffer)
      .resize(192, 192, { 
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(path.join(publicDir, 'icon.png'));
    console.log('✓ Generated icon.png (192x192)');

    // Generate apple-touch-icon (180x180)
    await sharp(logoBuffer)
      .resize(180, 180, { 
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✓ Generated apple-touch-icon.png (180x180)');

    // Generate favicon.png (32x32)
    await sharp(logoBuffer)
      .resize(32, 32, { 
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));
    console.log('✓ Generated favicon.png (will be used as fallback)');

    console.log('\n✅ All favicons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
