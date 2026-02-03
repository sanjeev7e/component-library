# Component App

A React component library built with TypeScript and Vite.

## Features

- 🎨 Modern React components
- 📦 Tree-shakeable ES modules
- 🔷 Full TypeScript support
- ⚡ Built with Vite for optimal performance
- 🎯 Zero dependencies (peer dependencies only)

## Installation

```bash
npm install component-app
# or
yarn add component-app
# or
bun add component-app
```

## Usage

Import components from the library:

```tsx
import { Button } from 'component-app';

function App() {
  return (
    <div>
      <Button />
    </div>
  );
}
```

For more detailed usage examples, see [USAGE_EXAMPLE.md](./USAGE_EXAMPLE.md).

## Available Components

- **Button**: A basic button component

## Development

### Install dependencies

```bash
bun install
```

### Build the library

```bash
bun run build:lib
```

This will generate:
- ES module: `dist/component-app.es.js`
- UMD module: `dist/component-app.umd.js`
- TypeScript declarations: `dist/index.d.ts`

### Development mode

Run the development server to test components:

```bash
bun run dev
```

### Linting

```bash
bun run lint
```

## Project Structure

```
component-app/
├── src/
│   ├── components/        # Component library
│   │   └── Button.tsx
│   ├── index.ts          # Main entry point (exports all components)
│   ├── App.tsx           # Development/testing app
│   └── main.tsx          # Development entry
├── dist/                 # Build output (generated)
├── package.json
├── vite.config.ts        # Vite configuration for library mode
├── tsconfig.lib.json     # TypeScript config for library build
└── README.md
```

## Adding New Components

1. Create your component in `src/components/`:

```tsx
// src/components/MyComponent.tsx
export default function MyComponent() {
  return <div>My Component</div>;
}
```

2. Export it from `src/index.ts`:

```tsx
export { default as MyComponent } from './components/MyComponent';
```

3. Build the library:

```bash
bun run build:lib
```

## Publishing

### To npm Registry

1. Update the version in `package.json`:

```bash
npm version patch  # or minor, or major
```

2. Build the library:

```bash
bun run build:lib
```

3. Publish to npm:

```bash
npm publish
```

### Local Testing

Before publishing, you can test your library locally:

```bash
# In component-app directory
bun link

# In your test project
bun link component-app
```

## Package Configuration

The library is configured to work with modern JavaScript tooling:

- **Main entry**: UMD build for CommonJS environments
- **Module entry**: ES module for modern bundlers
- **Types entry**: TypeScript declarations
- **Exports field**: Proper module resolution for Node.js and bundlers
- **Peer dependencies**: React 18+ or 19+

## License

MIT
