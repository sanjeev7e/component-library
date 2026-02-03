# Usage Example

This document shows how to use the component library in other projects.

## Installation

### Option 1: From npm (after publishing)

```bash
npm install component-app
# or
yarn add component-app
# or
bun add component-app
```

### Option 2: Local development (before publishing)

In your component library directory:

```bash
npm link
# or
bun link
```

In your consuming project:

```bash
npm link component-app
# or
bun link component-app
```

### Option 3: Direct file path (for local testing)

In your consuming project's `package.json`:

```json
{
  "dependencies": {
    "component-app": "file:../component-app"
  }
}
```

## Usage in a React Project

### Example 1: Basic Usage

```tsx
import { Button } from 'component-app';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <Button />
    </div>
  );
}

export default App;
```

### Example 2: Multiple Components

```tsx
import { Button } from 'component-app';

function MyPage() {
  return (
    <div>
      <Button />
      <Button />
      <Button />
    </div>
  );
}
```

## TypeScript Support

The library includes full TypeScript definitions. Your IDE will provide autocomplete and type checking automatically.

```tsx
import { Button } from 'component-app';
// TypeScript will know the Button component's props and types
```

## Build Output

The library provides multiple module formats:

- **ES Module** (`dist/component-app.es.js`): For modern bundlers (Vite, Webpack 5+, Rollup)
- **UMD** (`dist/component-app.umd.js`): For legacy environments and direct browser usage
- **TypeScript Declarations** (`dist/index.d.ts`): For TypeScript projects

Your bundler will automatically choose the appropriate format based on your project configuration.
