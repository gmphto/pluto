// Simple script to generate placeholder icons
// Note: For production, you should replace these with proper designed icons

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons
const generateIcon = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#E60023" rx="${size / 8}"/>
  <text
    x="50%"
    y="50%"
    font-size="${size * 0.5}"
    fill="white"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="Arial, sans-serif"
    font-weight="bold"
  >📊</text>
</svg>`;
};

// Generate icons
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const svg = generateIcon(size);
  const outputPath = path.join(iconsDir, `icon${size}.svg`);
  fs.writeFileSync(outputPath, svg);
  console.log(`Generated: icon${size}.svg`);
});

console.log('\nIcon generation complete!');
console.log('Note: For production, replace SVG icons with proper PNG icons or convert SVGs to PNGs.');
