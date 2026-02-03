import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // Disable React Compiler for library builds to avoid require() issues
          // You can enable it for development by checking process.env.NODE_ENV
          // [['babel-plugin-react-compiler']],
        ],
      },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ComponentApp',
      formats: ['es', 'umd'],
      fileName: (format) => `component-app.${format}.js`,
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
