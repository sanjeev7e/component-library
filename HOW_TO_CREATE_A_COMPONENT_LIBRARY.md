# How to Create a React Component Library with TypeScript and Vite

This guide explains how to create a publishable React component library similar to this project, with detailed explanations of the key commits that transformed a basic React app into a distributable library.

## Table of Contents

1. [Overview](#overview)
2. [Initial Setup](#initial-setup)
3. [Key Commits Explained](#key-commits-explained)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Publishing Your Library](#publishing-your-library)
6. [Best Practices](#best-practices)

---

## Overview

This project demonstrates how to build a React component library that:

- ✅ Can be published to npm
- ✅ Supports both ES modules and UMD formats
- ✅ Includes TypeScript declarations for full type safety
- ✅ Uses Vite for fast builds
- ✅ Has zero runtime dependencies (only peer dependencies)
- ✅ Is tree-shakeable for optimal bundle sizes

---

## Initial Setup

Start with a basic Vite + React + TypeScript project:

```bash
npm create vite@latest my-component-library -- --template react-ts
cd my-component-library
npm install
```

Or with Bun:

```bash
bun create vite my-component-library --template react-ts
cd my-component-library
bun install
```

---

## Key Commits Explained

### Commit 1: Initial Library Setup (23ece4a)

**Commit Message:** "Add initial setup for component library with TypeScript and Vite"

This commit transformed a basic React app into a publishable component library. Here's what was done:

#### 1. Created `.npmignore`

This file tells npm which files to exclude from the published package, keeping it lightweight.

```
# Source files
src/
public/

# Config files
vite.config.ts
tsconfig*.json
eslint.config.js

# Development files
.gitignore
.cursor/
*.log
node_modules/
bun.lock

# Keep only dist folder
!dist/
```

**Why this matters:** Users only need the built files (`dist/`), not your source code or config files. This reduces package size significantly.

#### 2. Updated `package.json`

Key changes made to transform it into a library:

```json
{
  "name": "component-app",
  "private": false,              // ← Changed from true to allow publishing
  "version": "0.0.1",            // ← Set initial version
  "description": "A React component library built with TypeScript and Vite",
  "keywords": ["react", "components", "ui", "typescript", "vite"],
  
  // Entry points for different module systems
  "main": "./dist/component-app.umd.js",      // CommonJS/UMD entry
  "module": "./dist/component-app.es.js",     // ES module entry
  "types": "./dist/index.d.ts",               // TypeScript declarations
  
  // Modern exports field for better module resolution
  "exports": {
    ".": {
      "import": "./dist/component-app.es.js",
      "require": "./dist/component-app.umd.js",
      "types": "./dist/index.d.ts"
    }
  },
  
  // Only include dist folder in published package
  "files": ["dist"],
  
  "scripts": {
    "build:lib": "vite build && tsc --project tsconfig.lib.json"
  },
  
  // React as peer dependencies (not bundled with library)
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  
  // No runtime dependencies!
  "dependencies": {},
  
  // React moved to devDependencies for development
  "devDependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    // ... other dev dependencies
  }
}
```

**Key concepts:**

- **`private: false`**: Allows the package to be published to npm
- **`main`, `module`, `types`**: Define entry points for different environments
- **`exports`**: Modern way to define package exports with conditional resolution
- **`files`**: Whitelist of files to include in the published package
- **`peerDependencies`**: React is not bundled; users must install it separately
- **Empty `dependencies`**: The library has zero runtime dependencies

#### 3. Created `vite.config.ts` for Library Mode

This is the most critical configuration for building a library:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // React Compiler disabled for library builds
          // to avoid require() issues in consuming projects
        ],
      },
    }),
  ],
  build: {
    lib: {
      // Entry point for the library
      entry: resolve(__dirname, 'src/index.ts'),
      
      // Global variable name for UMD builds
      name: 'ComponentApp',
      
      // Output formats: ES modules and UMD
      formats: ['es', 'umd'],
      
      // Output file naming pattern
      fileName: (format) => `component-app.${format}.js`,
    },
    rollupOptions: {
      // Don't bundle React - it's a peer dependency
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      
      // Global variable names for externalized dependencies in UMD builds
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
})
```

**Key concepts:**

- **`build.lib`**: Enables Vite's library mode instead of app mode
- **`entry`**: Points to your library's main export file
- **`formats`**: Generates both ES modules (modern) and UMD (legacy/browser)
- **`external`**: Prevents React from being bundled (critical for avoiding duplicate React instances)
- **`globals`**: Maps external dependencies to global variables for UMD builds

#### 4. Created `tsconfig.lib.json`

Separate TypeScript config for building library type declarations:

```json
{
  "extends": "./tsconfig.app.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declaration": true,           // Generate .d.ts files
    "declarationMap": true,        // Generate source maps for declarations
    "emitDeclarationOnly": true,   // Only emit declarations (Vite handles JS)
    "noEmit": false                // Allow emitting files
  },
  "include": [
    "src/index.ts",
    "src/components/**/*.ts",
    "src/components/**/*.tsx"
  ],
  "exclude": [
    "src/main.tsx",               // Exclude dev/test files
    "src/App.tsx",
    "**/*.test.ts",
    "**/*.test.tsx"
  ]
}
```

**Why separate config?**

- The main `tsconfig.app.json` is for development
- `tsconfig.lib.json` is specifically for building type declarations
- It excludes dev-only files like `App.tsx` and `main.tsx`

#### 5. Created `src/index.ts`

The main entry point that exports all components:

```typescript
// Export all components from here
export { default as Button } from './components/Button';
export { default as Input } from './components/Input';
```

**This is crucial:** All components must be exported from this single file. This enables:

- Tree-shaking (unused components aren't bundled)
- Clean import syntax: `import { Button } from 'component-app'`
- Single source of truth for public API

#### 6. Enhanced Documentation

- Updated `README.md` with library usage instructions
- Created `USAGE_EXAMPLE.md` showing how to consume the library

### Commit 2: Add Postinstall Script (96e81cd)

**Commit Message:** "Add postinstall script"

This commit added a single line to `package.json`:

```json
{
  "scripts": {
    "postinstall": "npm run build"
  }
}
```

**What this does:**

When someone installs your library via npm/yarn/bun, it automatically runs `npm run build` after installation. This ensures the `dist/` folder is always built and ready.

**Note:** This approach has trade-offs:

**Pros:**
- Ensures the library is always built after installation
- Useful for local development with `npm link` or `file:` dependencies

**Cons:**
- Increases installation time for users
- Generally not recommended for published npm packages (you should publish pre-built files)
- Can cause issues in CI/CD environments

**Best practice:** For published packages, build before publishing and include the `dist/` folder in your npm package. Remove the postinstall script for production libraries.

---

## Step-by-Step Implementation

### Step 1: Start with Vite + React + TypeScript

```bash
bun create vite my-library --template react-ts
cd my-library
bun install
```

### Step 2: Create Your Components

Create components in `src/components/`:

```tsx
// src/components/Button.tsx
export default function Button() {
  return <button>Click me</button>;
}
```

### Step 3: Create Library Entry Point

Create `src/index.ts`:

```typescript
export { default as Button } from './components/Button';
// Add more exports as you create components
```

### Step 4: Configure Vite for Library Mode

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyLibrary',
      formats: ['es', 'umd'],
      fileName: (format) => `my-library.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
})
```

### Step 5: Create TypeScript Config for Library

Create `tsconfig.lib.json`:

```json
{
  "extends": "./tsconfig.app.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "noEmit": false
  },
  "include": ["src/index.ts", "src/components/**/*.ts", "src/components/**/*.tsx"],
  "exclude": ["src/main.tsx", "src/App.tsx", "**/*.test.ts", "**/*.test.tsx"]
}
```

### Step 6: Update package.json

```json
{
  "name": "my-library",
  "private": false,
  "version": "0.0.1",
  "description": "My awesome React component library",
  "type": "module",
  "main": "./dist/my-library.umd.js",
  "module": "./dist/my-library.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/my-library.es.js",
      "require": "./dist/my-library.umd.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "build:lib": "vite build && tsc --project tsconfig.lib.json",
    "lint": "eslint ."
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "dependencies": {},
  "devDependencies": {
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "typescript": "~5.9.3",
    "vite": "^7.0.0"
  }
}
```

### Step 7: Create .npmignore

```
# Source files
src/
public/

# Config files
vite.config.ts
tsconfig*.json
eslint.config.js

# Development files
.gitignore
*.log
node_modules/
bun.lock

# Keep only dist folder
!dist/
```

### Step 8: Build Your Library

```bash
bun run build:lib
```

This generates:
- `dist/my-library.es.js` - ES module
- `dist/my-library.umd.js` - UMD module
- `dist/index.d.ts` - TypeScript declarations

### Step 9: Test Locally

Before publishing, test your library locally:

```bash
# In your library directory
bun link

# In a test project
bun link my-library
```

Then import and use your components:

```tsx
import { Button } from 'my-library';

function App() {
  return <Button />;
}
```

---

## Publishing Your Library

### Prerequisites

1. Create an npm account at [npmjs.com](https://www.npmjs.com)
2. Login via CLI: `npm login`

### Publishing Steps

1. **Update version:**

```bash
npm version patch  # 0.0.1 → 0.0.2
# or
npm version minor  # 0.0.1 → 0.1.0
# or
npm version major  # 0.0.1 → 1.0.0
```

2. **Build the library:**

```bash
bun run build:lib
```

3. **Publish to npm:**

```bash
npm publish
```

4. **Verify publication:**

Visit `https://www.npmjs.com/package/your-library-name`

### Publishing Best Practices

- **Always build before publishing** - Don't rely on postinstall scripts
- **Test locally first** - Use `npm link` or `bun link`
- **Use semantic versioning** - Follow [semver](https://semver.org/)
- **Include a good README** - With usage examples and API docs
- **Add a license** - MIT is common for open source
- **Consider a changelog** - Document changes between versions

---

## Best Practices

### 1. Component Design

- **Keep components simple and focused** - Single responsibility principle
- **Use TypeScript** - Provide type safety for consumers
- **Export props types** - Let users import and extend them
- **Avoid external dependencies** - Keep the bundle small

Example:

```tsx
// src/components/Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  onClick, 
  children 
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Also export the props type
export type { ButtonProps };
```

### 2. Project Structure

```
my-library/
├── src/
│   ├── components/           # All components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── Input/
│   │       ├── Input.tsx
│   │       └── index.ts
│   ├── index.ts             # Main exports
│   ├── App.tsx              # Dev/testing app
│   └── main.tsx             # Dev entry point
├── dist/                    # Build output (gitignored)
├── .npmignore
├── package.json
├── vite.config.ts
├── tsconfig.lib.json
└── README.md
```

### 3. Development Workflow

Keep a dev app for testing components:

```tsx
// src/App.tsx
import { Button } from './index';

function App() {
  return (
    <div>
      <h1>Component Library Dev</h1>
      <Button>Test Button</Button>
    </div>
  );
}

export default App;
```

Run with `bun run dev` to test components during development.

### 4. Version Management

Follow semantic versioning:

- **Patch (0.0.x)**: Bug fixes
- **Minor (0.x.0)**: New features (backwards compatible)
- **Major (x.0.0)**: Breaking changes

### 5. Documentation

Include in your README:

- Installation instructions
- Basic usage examples
- Component API documentation
- TypeScript support information
- Contributing guidelines
- License

### 6. Testing

Add tests for your components:

```bash
bun add -d vitest @testing-library/react @testing-library/jest-dom
```

```tsx
// src/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### 7. CI/CD

Set up GitHub Actions to:

- Run tests on every PR
- Build the library
- Publish to npm on releases

Example `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm install
      - run: npm run build:lib
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Common Pitfalls to Avoid

### 1. Bundling React

**Problem:** React gets bundled with your library, causing "Invalid Hook Call" errors.

**Solution:** Always externalize React:

```typescript
// vite.config.ts
rollupOptions: {
  external: ['react', 'react-dom', 'react/jsx-runtime'],
}
```

### 2. Missing Type Declarations

**Problem:** TypeScript users can't get type hints.

**Solution:** Ensure `tsconfig.lib.json` has:

```json
{
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true
  }
}
```

And run: `tsc --project tsconfig.lib.json`

### 3. Publishing Source Files

**Problem:** Your npm package is huge because it includes source files.

**Solution:** Use `.npmignore` or `files` field in `package.json`:

```json
{
  "files": ["dist"]
}
```

### 4. Not Testing Before Publishing

**Problem:** You publish broken code.

**Solution:** Always test with `npm link` or `bun link` first.

### 5. Forgetting to Build

**Problem:** You publish without building, so the `dist/` folder is outdated.

**Solution:** Add a prepublish script:

```json
{
  "scripts": {
    "prepublishOnly": "npm run build:lib"
  }
}
```

---

## Summary

Creating a React component library involves:

1. **Setting up Vite in library mode** - Configure `vite.config.ts` with `build.lib`
2. **Configuring TypeScript** - Create `tsconfig.lib.json` for type declarations
3. **Managing dependencies** - Use peer dependencies for React
4. **Creating entry points** - Export all components from `src/index.ts`
5. **Configuring package.json** - Set up `main`, `module`, `types`, and `exports` fields
6. **Excluding unnecessary files** - Use `.npmignore` or `files` field
7. **Building and testing** - Use `npm link` for local testing
8. **Publishing** - Build, version, and publish to npm

The two key commits demonstrated:

- **Commit 23ece4a**: Complete transformation from app to library (configuration, exports, build setup)
- **Commit 96e81cd**: Added postinstall script (though this is optional and not recommended for production)

Follow this guide, and you'll have a professional, publishable React component library ready to share with the world!
