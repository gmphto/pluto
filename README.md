# Pinterest Stats Analyzer - Chrome Extension

> Reveal Pinterest stats for each pin! Sort pins by likes, comments or creation date with this marketing analyzer tool.

## 🚀 Features

### Real-Time Pin Analytics
- **Stats Display**: View vital stats like saves, likes, comments, and creation date directly on each pin
- **Pin Stats Viewer**: Analyze and gain actionable Pinterest insights to guide content strategy
- **Local Data Storage**: Automatically saves data of displayed pins to your browser's local storage
- **Advanced Pin Analytics**: Dedicated stats table page with detailed data analysis

### Powerful Sorting & Filtering
- **Sort by Multiple Metrics**: Sort pins by saves, likes, comments, or creation date
- **Advanced Filtering**: Filter pins by minimum/maximum values for any metric
- **Search Functionality**: Quickly find pins by title or URL
- **Real-Time Updates**: Stats are collected automatically as you browse

### Supported Pages
The extension works on the following Pinterest pages:
- Home Feed
- Search Page
- Ideas Page
- Detailed Pin Page

**Note**: For the best experience, please ensure you are logged into Pinterest.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Chrome browser

## 🛠️ Installation & Development

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd pluto
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Prepare Icons

The extension includes placeholder SVG icons. For Chrome extensions, you need PNG icons:

**Option A**: Convert SVGs to PNGs
```bash
# Install a converter tool
npm install -g svgexport

# Convert icons (run from project root)
svgexport public/icons/icon16.svg public/icons/icon16.png 16:16
svgexport public/icons/icon48.svg public/icons/icon48.png 48:48
svgexport public/icons/icon128.svg public/icons/icon128.png 128:128
```

**Option B**: Use your own PNG icons
- Replace the placeholder icons in `public/icons/` with your own 16x16, 48x48, and 128x128 PNG files

### 4. Build the Extension

```bash
# Development build (with watch mode)
npm run dev

# Production build
npm run build
```

This will create a `dist/` folder with the compiled extension.

### 5. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` folder from this project
5. The extension should now be active!

## 📊 How to Use

### On Pinterest Pages

1. **Browse Pinterest**: Visit Pinterest and navigate to any supported page (Home, Search, Ideas, or Pin detail)
2. **View Stats**: The extension automatically displays stats overlays on each pin showing:
   - 📌 Saves
   - ❤️ Likes
   - 💬 Comments
   - 📅 Creation Date

3. **Access Stats Table**: Click the floating "Open Pin Stats Table" button (bottom right) to view all collected data

### Stats Table Page

The dedicated stats page offers advanced features:

- **Search**: Find pins by title or URL
- **Sort**: Click any column header to sort by that metric
- **Filter**: Use the filter panel to narrow down pins by:
  - Minimum/Maximum Saves
  - Minimum/Maximum Likes
  - Minimum/Maximum Comments
- **Export**: All data is automatically saved to your browser's local storage
- **Clear Data**: Remove all collected data with one click

## 🏗️ Project Structure

```
pluto/
├── public/
│   ├── icons/              # Extension icons
│   ├── manifest.json       # Chrome extension manifest
│   └── stats.html          # Stats table page HTML
├── src/
│   ├── background/         # Background service worker
│   ├── components/         # React components
│   │   ├── FloatingButton.tsx
│   │   └── PinStatsOverlay.tsx
│   ├── content/            # Content script (injected into Pinterest)
│   │   └── index.tsx
│   ├── stats/              # Stats table page
│   │   ├── StatsTable.tsx
│   │   └── index.tsx
│   ├── types/              # TypeScript type definitions
│   │   └── pinterest.ts
│   └── utils/              # Utility functions
│       ├── pinterest.ts    # Pinterest data extraction
│       └── storage.ts      # Chrome storage management
├── scripts/
│   └── generate-icons.js   # Icon generation script
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

## 🔧 Development Scripts

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build

# Type checking
npm run type-check
```

## 🎯 Technical Details

### Technologies Used

- **TypeScript**: Type-safe code
- **React**: UI components
- **Webpack**: Module bundling
- **Chrome Extension API**: Storage, messaging, content scripts

### Data Extraction

The extension uses multiple methods to extract Pinterest data:

1. **DOM Parsing**: Extracts visible stats from page elements
2. **React Fiber**: Accesses React component props for accurate data
3. **Data Attributes**: Reads Pinterest's data-test-id attributes
4. **Text Analysis**: Parses stats from visible text with support for K/M/B notation

### Storage

All pin data is stored locally using Chrome's `storage.local` API:
- Automatic deduplication by pin ID
- Timestamps for tracking when data was collected
- No external servers - all data stays on your device

## 🔒 Privacy & Permissions

### Required Permissions

- **storage**: To save pin data locally in your browser
- **activeTab**: To access the current tab when you click the extension icon

### Host Permissions

- **pinterest.com**: To inject content scripts and access Pinterest pages
- **pinimg.com**: To access Pinterest images

### Data Privacy

- All data is stored **locally** on your device
- No data is sent to external servers
- No tracking or analytics
- No user identification

## 🐛 Troubleshooting

### Stats Not Showing?

1. Make sure you're logged into Pinterest
2. Refresh the Pinterest page after installing the extension
3. Check that the extension is enabled in `chrome://extensions/`

### Build Errors?

1. Delete `node_modules/` and `dist/` folders
2. Run `npm install` again
3. Try `npm run build` again

### Icons Not Displaying?

1. Make sure PNG icons exist in `public/icons/`
2. Icons must be exactly 16x16, 48x48, and 128x128 pixels
3. Rebuild the extension after adding icons

## 🚀 Future Enhancements

Potential features for future versions:

- Export data to CSV/JSON
- Pin engagement rate calculations
- Trend analysis over time
- Compare pins side-by-side
- Browser action popup with quick stats
- Multiple Pinterest account support
- Dark mode theme

## 📝 License

MIT License - feel free to use and modify for your needs.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## ⚠️ Disclaimer

This is an unofficial tool and is not affiliated with Pinterest. Use responsibly and in accordance with Pinterest's Terms of Service. This tool is for personal analytics and research purposes.

---

**Happy Pinning! 📌**
