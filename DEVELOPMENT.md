# Development Guide

This guide covers the technical details for developing and extending the Pinterest Stats Analyzer extension.

## 🏗️ Architecture Overview

### Extension Components

```
┌─────────────────────────────────────────────────────┐
│                  Chrome Extension                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Background  │  │   Content    │  │   Stats   │ │
│  │   Service    │◄─┤    Script    │  │   Page    │ │
│  │   Worker     │  │              │  │           │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│                           │                ▲        │
│                           ▼                │        │
│                    ┌─────────────┐         │        │
│                    │   Storage   │─────────┘        │
│                    │   Manager   │                  │
│                    └─────────────┘                  │
└─────────────────────────────────────────────────────┘
```

### Data Flow

1. **Content Script** runs on Pinterest pages
2. **Detects** pin elements using DOM queries and MutationObserver
3. **Extracts** stats from multiple sources (DOM, React props, data attributes)
4. **Stores** pin data using Chrome Storage API
5. **Renders** React overlays on each pin
6. **Stats Page** reads from storage and provides analytics UI

## 📁 File Structure Explained

### `/src/types/pinterest.ts`
Type definitions for the entire extension:
- `PinStats`: Core pin data structure
- `FilterOptions`: Filter parameters
- `SortField` & `SortOrder`: Sorting types
- `StorageData`: Storage format

### `/src/utils/storage.ts`
Manages Chrome storage operations:
- `savePins()`: Save entire pin array
- `getPins()`: Retrieve all pins
- `addPin()`: Add single pin with deduplication
- `addPins()`: Batch add with deduplication
- `clearPins()`: Remove all data

### `/src/utils/pinterest.ts`
Pinterest-specific data extraction:
- `extractPinFromElement()`: Main extraction logic
- `extractPinDataFromDOM()`: Multi-method data extraction
- `findReactProps()`: Access React component data
- `parseNumber()`: Handle K/M/B notation
- `fetchPinDetails()`: API call for detailed stats (optional)

### `/src/content/index.tsx`
Content script injector:
- `PinterestStatsInjector`: Main class
- `processPins()`: Batch process pin elements
- `setupObserver()`: Watch for new pins
- `addStatsOverlay()`: Inject React overlay

### `/src/components/`
React UI components:
- `PinStatsOverlay.tsx`: Overlay shown on each pin
- `FloatingButton.tsx`: Persistent action button

### `/src/stats/`
Stats table page:
- `StatsTable.tsx`: Full analytics dashboard
- `index.tsx`: Entry point

## 🔧 Key Technologies

### TypeScript
- Strict mode enabled
- All types defined in `/src/types/`
- No implicit any

### React 18
- Functional components with hooks
- `useState`, `useEffect`, `useMemo`
- ReactDOM.createRoot for concurrent mode

### Webpack 5
- Multiple entry points (content, background, stats)
- TypeScript loader (ts-loader)
- CSS loader for styling
- Copy plugin for static assets

### Chrome Extension Manifest V3
- Service worker instead of background page
- Declarative content scripts
- Host permissions for Pinterest domains

## 🎨 Styling Approach

All styling is done via inline React styles:
- No CSS files (simplifies build)
- Type-safe style objects
- Component-scoped styles
- Easy to customize per-component

To change styles, edit the `styles` object in each component file.

## 🔍 Data Extraction Methods

The extension uses multiple fallback methods to extract Pinterest stats:

### Method 1: Data Attributes
```typescript
const statsElement = element.querySelector('[data-test-id="pin-stats"]');
```
Pinterest uses `data-test-id` attributes that we can query.

### Method 2: React Fiber
```typescript
const fiberKey = Object.keys(element).find(key =>
  key.startsWith('__reactFiber')
);
```
Accesses React's internal fiber structure for component props.

### Method 3: Text Parsing
```typescript
const regex = new RegExp(`(\\d+(?:\\.\\d+)?[KMB]?)\\s*${keyword}`, 'i');
```
Parses visible text for numbers with K/M/B suffixes.

### Method 4: API Calls (Optional)
```typescript
fetch('https://www.pinterest.com/resource/PinResource/get/')
```
Can make authenticated requests to Pinterest's internal API.

## 🔨 Building & Bundling

### Development Build
```bash
npm run dev
```
- Runs Webpack in watch mode
- Faster builds
- Not minified
- Source maps included

### Production Build
```bash
npm run build
```
- Single build
- Minified output
- Optimized for size
- No source maps

## 🧪 Testing Locally

### Manual Testing Checklist

1. **Install Extension**
   - Build with `npm run build`
   - Load `dist/` folder in Chrome

2. **Test on Home Feed**
   - Visit pinterest.com
   - Verify stats overlays appear
   - Check floating button works

3. **Test on Search**
   - Search for any term
   - Verify stats on results
   - Test sorting/filtering

4. **Test Stats Page**
   - Click floating button
   - Verify table loads
   - Test all filters
   - Test all sort columns
   - Test search

5. **Test Data Persistence**
   - Browse pins
   - Close tab
   - Open stats page
   - Verify data persists

## 🚀 Extending Functionality

### Add a New Metric

1. **Update Type Definition**
```typescript
// src/types/pinterest.ts
export interface PinStats {
  // ... existing fields
  newMetric: number;
}
```

2. **Extract the Data**
```typescript
// src/utils/pinterest.ts
return {
  // ... existing fields
  newMetric: this.extractNewMetric(element),
};
```

3. **Display in Overlay**
```typescript
// src/components/PinStatsOverlay.tsx
<div>
  <span>{stats.newMetric}</span>
</div>
```

4. **Add to Table**
```typescript
// src/stats/StatsTable.tsx
<th>New Metric</th>
// ...
<td>{pin.newMetric}</td>
```

### Add a New Filter

1. **Update FilterOptions Type**
```typescript
// src/types/pinterest.ts
export interface FilterOptions {
  // ... existing fields
  minNewMetric?: number;
}
```

2. **Add Filter UI**
```typescript
// src/stats/StatsTable.tsx
<input
  type="number"
  value={filters.minNewMetric || ''}
  onChange={(e) => setFilters({
    ...filters,
    minNewMetric: e.target.value ? parseInt(e.target.value) : undefined
  })}
/>
```

3. **Apply Filter**
```typescript
if (filters.minNewMetric !== undefined) {
  result = result.filter(pin => pin.newMetric >= filters.minNewMetric!);
}
```

## 🐛 Debugging Tips

### Enable Verbose Logging
Add console logs in:
- `src/content/index.tsx` - Content script actions
- `src/utils/pinterest.ts` - Extraction logic

### Inspect Storage
```javascript
chrome.storage.local.get('pinterest_pins_data', (result) => {
  console.log(result);
});
```

### Test Extraction
Open Pinterest page console and run:
```javascript
document.querySelectorAll('[data-test-id="pin"]')
```

### Check React Fiber
```javascript
const element = document.querySelector('[data-test-id="pin"]');
console.log(Object.keys(element));
```

## 📦 Packaging for Distribution

### Create Extension Package
```bash
# Build production version
npm run build

# Zip the dist folder
cd dist
zip -r ../pinterest-stats-extension.zip .
cd ..
```

### Chrome Web Store Checklist
- [ ] Replace placeholder icons with proper designs
- [ ] Add privacy policy URL
- [ ] Create promotional images (1280x800, 640x400, 440x280)
- [ ] Write detailed description
- [ ] Set up support email
- [ ] Test on multiple Pinterest pages
- [ ] Test with different Pinterest accounts

## 🔐 Security Considerations

### Content Security Policy
The extension follows CSP best practices:
- No inline scripts
- No eval()
- All code bundled

### Data Privacy
- All data stored locally
- No external API calls (except Pinterest)
- No tracking or analytics
- No user identification

### Permissions
Request only necessary permissions:
- `storage` - For local data
- `activeTab` - For current tab access
- Host permissions limited to pinterest.com

## 🤝 Contributing Guidelines

1. **Code Style**
   - Use TypeScript strict mode
   - Follow existing patterns
   - Add types for all functions
   - Use functional React components

2. **Commit Messages**
   - Use conventional commits
   - Be descriptive

3. **Testing**
   - Test on multiple Pinterest pages
   - Verify data persistence
   - Check performance

4. **Documentation**
   - Update README for user-facing changes
   - Update this guide for technical changes
   - Add JSDoc comments for complex functions

## 📝 Known Limitations

1. **Pinterest API**: Unofficial access - may break if Pinterest changes their structure
2. **Rate Limiting**: No built-in rate limiting for API calls
3. **Image Extraction**: May not work for all pin types
4. **Mobile**: Designed for desktop Pinterest only

## 🔮 Future Improvements

### Short Term
- [ ] Export to CSV/JSON
- [ ] Browser action popup
- [ ] Dark mode theme
- [ ] Better error handling

### Long Term
- [ ] Engagement rate calculations
- [ ] Trend analysis over time
- [ ] Board-level analytics
- [ ] Multi-account support
- [ ] Firefox extension port

---

**Happy coding! 💻**
