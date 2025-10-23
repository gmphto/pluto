# Contributing to Pinterest Stats Extension

Thank you for your interest in contributing to the Pinterest Stats Extension! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## Code of Conduct

This project adheres to a code of conduct that promotes a welcoming and inclusive environment. By participating, you are expected to uphold this code.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Chrome browser (for testing)
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pluto.git
   cd pluto
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up Git hooks:
   ```bash
   npm run prepare
   ```

5. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running in Development Mode

```bash
npm run dev
```

This starts Webpack in watch mode, automatically recompiling when you make changes.

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `dist` directory from the project

### Testing Your Changes

1. Run the test suite:
   ```bash
   npm test
   ```

2. Run tests in watch mode during development:
   ```bash
   npm run test:watch
   ```

3. Check test coverage:
   ```bash
   npm run test:coverage
   ```

### Code Quality Checks

Before committing, ensure your code passes all checks:

```bash
npm run validate
```

This runs:
- TypeScript type checking (`npm run type-check`)
- ESLint linting (`npm run lint`)
- Prettier formatting (`npm run format:check`)
- Jest tests (`npm test`)

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode and fix all type errors
- Avoid using `any` types - use `unknown` and type guards instead
- Prefer interfaces for object types that may be extended
- Use type aliases for unions, intersections, and simple types

### Naming Conventions

- **Files**: Use kebab-case for file names (e.g., `pin-stats-overlay.tsx`)
- **Classes**: Use PascalCase (e.g., `StorageManager`)
- **Functions**: Use camelCase (e.g., `extractPinData`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_PINS`)
- **Interfaces/Types**: Use PascalCase (e.g., `PinStats`)

### Code Organization

- Place reusable components in `src/components/`
- Place page-level components in their respective directories (e.g., `src/stats/`)
- Place utilities in `src/utils/` or `src/lib/`
- Place types in `src/types/`
- Place configuration in `src/config/`

### Documentation

- Add JSDoc comments to all public functions and classes
- Include `@param`, `@returns`, `@throws` tags as appropriate
- Provide code examples for complex utilities

Example:
```typescript
/**
 * Extracts Pinterest pin statistics from a DOM element
 *
 * @param element - The DOM element containing pin data
 * @param interceptedData - Optional API data to enhance extraction
 * @returns Pin statistics or null if extraction fails
 * @throws {ExtractionError} If element is invalid
 *
 * @example
 * ```typescript
 * const stats = PinterestExtractor.extractPinFromElement(element);
 * if (stats) {
 *   console.log(`Pin has ${stats.saves} saves`);
 * }
 * ```
 */
```

### Import Order

Imports should be organized in this order (enforced by ESLint):
1. React and React-related imports
2. External dependencies
3. Internal imports (utilities, components, types)
4. Type imports

Example:
```typescript
import React, { useState, useEffect } from 'react';

import { StorageManager } from '../utils/storage';
import { PinStatsOverlay } from '../components/PinStatsOverlay';

import type { PinStats } from '../types/pinterest';
```

## Testing

### Writing Tests

- Place test files next to the code they test, using the pattern `*.test.ts` or `*.test.tsx`
- Alternatively, place tests in `__tests__` directories
- Aim for at least 70% code coverage
- Write unit tests for utilities and integration tests for components

### Test Structure

Use the Arrange-Act-Assert pattern:

```typescript
it('should save pins to storage successfully', async () => {
  // Arrange
  const pins = [mockPin];

  // Act
  await StorageManager.savePins(pins);

  // Assert
  expect(chrome.storage.local.set).toHaveBeenCalledWith({
    pinterest_pins_data: expect.objectContaining({ pins }),
  });
});
```

### Mocking

- Mock Chrome APIs in `src/test-setup.ts`
- Use Jest mocks for external dependencies
- Clear mocks between tests using `beforeEach()`

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (build, CI, dependencies)
- `perf`: Performance improvements

### Examples

```
feat(storage): Add validation for pin data

- Validate pin structure before saving
- Add custom ValidationError class
- Improve error messages

Closes #123
```

```
fix(extractor): Handle missing pin titles gracefully

Previously, the extractor would fail when encountering pins
without titles. Now it falls back to "Untitled Pin".

Fixes #456
```

## Pull Request Process

### Before Submitting

1. Ensure all tests pass: `npm test`
2. Ensure code is formatted: `npm run format`
3. Ensure no linting errors: `npm run lint`
4. Update documentation if needed
5. Add tests for new functionality

### Submitting a PR

1. Push your changes to your fork
2. Open a pull request against the `main` branch
3. Fill out the PR template completely
4. Link any related issues
5. Wait for CI checks to pass
6. Respond to reviewer feedback

### PR Requirements

- All CI checks must pass
- Code must be reviewed by at least one maintainer
- Test coverage must not decrease
- Documentation must be updated for new features

### Review Process

1. A maintainer will review your PR within 3-5 business days
2. You may be asked to make changes
3. Once approved, a maintainer will merge your PR
4. Your contribution will be included in the next release!

## Project Structure

```
pluto/
├── .github/              # GitHub Actions workflows and templates
├── .husky/               # Git hooks
├── dist/                 # Compiled extension (generated)
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
├── scripts/              # Build and utility scripts
└── tests/                # Test utilities and fixtures
```

## Questions?

If you have questions or need help, please:
1. Check existing issues and pull requests
2. Review the documentation in `DEVELOPMENT.md`
3. Open a new issue with the "question" label

Thank you for contributing!
