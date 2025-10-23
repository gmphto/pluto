// Simple script to create minimal placeholder PNG icons
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Minimal 1x1 red PNG as placeholder (base64 decoded)
// This is a valid PNG file that browsers can render
const createPlaceholderPNG = (size) => {
  // Create a simple red square PNG
  // This is a base64 encoded minimal PNG
  const minimalPNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
    'base64'
  );
  return minimalPNG;
};

// Create icons
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const png = createPlaceholderPNG(size);
  const outputPath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(outputPath, png);
  console.log(`Created: icon${size}.png`);
});

console.log('\nPlaceholder PNG icons created!');
console.log('These are minimal placeholders. For production, replace with proper icons.');
console.log('You can create proper icons using tools like:');
console.log('  - Figma');
console.log('  - Canva');
console.log('  - Adobe Illustrator');
console.log('  - Or convert the SVG files using: npm install -g svgexport');
