<div align="center">
  <h1>Pinterest Stats Extension</h1>
  <p>A high-quality Chrome extension for analyzing Pinterest pin statistics</p>

  <p>
    <a href="https://github.com/gmphto/pluto/actions"><img src="https://github.com/gmphto/pluto/workflows/CI/badge.svg" alt="CI Status"></a>
    <a href="https://github.com/gmphto/pluto/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
    <a href="https://github.com/gmphto/pluto/releases"><img src="https://img.shields.io/github/v/release/gmphto/pluto" alt="Release"></a>
  </p>
</div>

---

## Overview

Pinterest Stats Extension is a professional-grade Chrome extension that reveals detailed statistics for Pinterest pins. Built with TypeScript and React, it provides real-time analytics, advanced filtering, and comprehensive data management for Pinterest power users and marketers.

### Key Features

- **Real-time Analytics**: View saves, likes, comments, and creation dates directly on pins
- **Advanced Filtering**: Filter and sort pins by multiple metrics
- **Local-First**: All data stored locally in your browser - no external servers
- **Performance Optimized**: Efficient DOM observation and data extraction
- **Type-Safe**: Built with strict TypeScript for reliability
- **Well-Tested**: Comprehensive test coverage with Jest

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Chrome browser

### Installation

```bash
# Clone the repository
git clone https://github.com/gmphto/pluto.git
cd pluto

# Install dependencies
npm install

# Build the extension
npm run build
```

### Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `dist` directory from the project

For detailed development instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md).

## Features

### Real-Time Pin Analytics

- **Stats Overlay**: Hover over any pin to see detailed statistics
- **Floating Action Button**: Quick access to your stats dashboard
- **Automatic Collection**: Stats are saved as you browse Pinterest
- **Multi-Page Support**: Works on home feed, search results, and pin pages

### Stats Dashboard

- **Sortable Table**: Sort by saves, likes, comments, or date
- **Advanced Filters**: Set minimum/maximum thresholds for any metric
- **Search**: Find pins by title or URL
- **Export Ready**: Data stored in Chrome's local storage

### Privacy & Performance

- **100% Local**: No data sent to external servers
- **Efficient**: Optimized mutation observers and data extraction
- **Lightweight**: Minimal impact on Pinterest's performance
- **Secure**: No unnecessary permissions requested

## Development

### Tech Stack

- **Language**: TypeScript 5.4+
- **UI Framework**: React 18
- **Build Tool**: Webpack 5
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions

### Development Commands

```bash
# Start development mode with watch
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Run all validation checks
npm run validate
```

### Project Structure

```
pluto/
├── .github/              # GitHub Actions workflows and templates
├── public/               # Static assets and manifest
├── src/
│   ├── background/       # Background service worker
│   ├── components/       # Reusable React components
│   ├── config/           # Configuration and constants
│   ├── content/          # Content scripts
│   ├── injected/         # Page context scripts
│   ├── lib/              # Core utilities (logger, errors)
│   ├── stats/            # Stats page components
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions and utilities
├── dist/                 # Compiled extension (generated)
└── tests/                # Test utilities and fixtures
```

## Architecture

### Data Flow

1. **Content Script** (`src/content/`) observes Pinterest DOM
2. **Injected Script** (`src/injected/`) intercepts API calls
3. **Extractor** (`src/utils/pinterest.ts`) parses pin data
4. **Storage Manager** (`src/utils/storage.ts`) persists data
5. **Stats Table** (`src/stats/`) displays analytics

### Key Components

- **PinterestExtractor**: Multi-method data extraction from DOM and React internals
- **StorageManager**: Type-safe Chrome storage interface with validation
- **Logger**: Centralized logging with different severity levels
- **Error Handler**: Custom error classes for different failure modes

## Testing

We maintain high code quality with comprehensive testing:

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Coverage requirements:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run validation (`npm run validate`)
5. Commit your changes (following [Conventional Commits](https://www.conventionalcommits.org/))
6. Push to your fork
7. Open a Pull Request

### Code Quality

All contributions must pass:
- ✅ TypeScript compilation with strict mode
- ✅ ESLint with no warnings
- ✅ Prettier formatting
- ✅ All tests passing
- ✅ Minimum 70% code coverage

## Troubleshooting

### Stats not showing?

1. Ensure you're logged into Pinterest
2. Refresh the Pinterest page
3. Check Chrome DevTools console for errors

### Extension not loading?

1. Verify Node version is 18.x or higher
2. Run `npm install` again
3. Try `npm run build` and reload the extension

For more help, see [DEVELOPMENT.md](./DEVELOPMENT.md) or [open an issue](https://github.com/gmphto/pluto/issues).

## Documentation

- [Development Guide](./DEVELOPMENT.md) - Detailed technical documentation
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Quick Start](./QUICKSTART.md) - 5-minute setup guide

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

Built with inspiration from high-quality open source projects like [Sentry](https://github.com/getsentry/sentry).

---

<div align="center">
  <p>Made with ❤️ by the Pinterest Stats Extension team</p>
  <p>
    <a href="https://github.com/gmphto/pluto/issues">Report Bug</a>
    ·
    <a href="https://github.com/gmphto/pluto/issues">Request Feature</a>
  </p>
</div>
