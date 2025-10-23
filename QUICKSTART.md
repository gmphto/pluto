# Quick Start Guide

Get the Pinterest Stats Analyzer extension up and running in 5 minutes!

## 🚀 Quick Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Icons (Optional)
```bash
node scripts/create-placeholder-pngs.js
```

Or use the provided minimal placeholders that were already generated.

### Step 3: Build
```bash
npm run build
```

### Step 4: Load in Chrome
1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Select the `dist/` folder

### Step 5: Test It Out
1. Visit [Pinterest](https://www.pinterest.com)
2. Login to your account
3. Browse pins on:
   - Home feed
   - Search results
   - Ideas page
4. You should see stats overlays on pins!

## 🎯 What You'll See

### On Pinterest Pages
Each pin will show an overlay at the bottom with:
- 📌 Saves count
- ❤️ Likes count
- 💬 Comments count
- 📅 Creation date

### Floating Button
A red floating button in the bottom-right corner shows:
- "Open Pin Stats Table" text
- Number of pins collected

### Stats Table Page
Click the floating button to open a full analytics dashboard with:
- **Search bar**: Find pins by title/URL
- **Filters**: Min/max values for saves, likes, comments
- **Sortable columns**: Click any header to sort
- **Pin previews**: Thumbnail images
- **Direct links**: Click to view pins on Pinterest

## 🔧 Development Mode

For active development with auto-rebuild:
```bash
npm run dev
```

Then reload the extension in Chrome after each build:
1. Go to `chrome://extensions/`
2. Click the refresh icon on your extension

## 🐛 Troubleshooting

### No stats showing?
- ✅ Make sure you're logged into Pinterest
- ✅ Refresh the page after installing
- ✅ Check extension is enabled in `chrome://extensions/`

### Build errors?
- ✅ Delete `node_modules/` and run `npm install` again
- ✅ Make sure you have Node.js v16 or higher

### Icons not working?
- ✅ Run `node scripts/create-placeholder-pngs.js`
- ✅ Or add your own PNG icons to `public/icons/`

## 📝 Next Steps

1. **Customize Icons**: Replace placeholder icons with your own designs
2. **Test Features**: Try sorting and filtering in the stats table
3. **Collect Data**: Browse Pinterest and build your analytics database
4. **Share**: Package and share with your team

## 🎨 Customization Tips

### Change Colors
Edit the color scheme in:
- `src/components/PinStatsOverlay.tsx` - Stats overlay colors
- `src/components/FloatingButton.tsx` - Button color (default: Pinterest red #E60023)
- `src/stats/StatsTable.tsx` - Table theme

### Modify Stats Display
Update `src/components/PinStatsOverlay.tsx` to:
- Add/remove metrics
- Change layout
- Adjust formatting

### Enhance Data Collection
Modify `src/utils/pinterest.ts` to:
- Extract additional data points
- Improve extraction accuracy
- Add API calls for more details

## 📚 Learn More

- Full documentation: See [README.md](README.md)
- Project structure: Check out `README.md` architecture section
- TypeScript types: Review `src/types/pinterest.ts`

---

**Happy analyzing! 📊**
