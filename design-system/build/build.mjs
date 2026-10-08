import * as esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = '/Users/muhammadessam/Projects/Muhammad Essam/src';
const shim = (f) => path.join(here, 'shims', f);

const shims = {
  'react': shim('react.js'),
  'react-dom': shim('react-dom.js'),
  'react/jsx-runtime': shim('jsx-runtime.js'),
  'react/jsx-dev-runtime': shim('jsx-runtime.js'),
  'next/image': shim('next-image.js'),
  'next/link': shim('next-link.js'),
  'next/navigation': shim('next-navigation.js'),
  '@/lib/services': shim('services.js'),
};

const plugin = {
  name: 'design-system-shims',
  setup(build) {
    build.onResolve({ filter: /^(react|react-dom|react\/jsx-runtime|react\/jsx-dev-runtime|next\/image|next\/link|next\/navigation|@\/lib\/services)$/ }, (args) => ({ path: shims[args.path] }));
    build.onResolve({ filter: /^@\/lib\/(images|constants)$/ }, (args) => ({ path: path.join(SRC, 'lib', args.path.split('/').pop() + '.ts') }));
  },
};

const result = await esbuild.build({
  entryPoints: [path.join(here, 'entry.tsx')],
  bundle: true,
  format: 'iife',
  globalName: 'EssamSite',
  minify: true,
  jsx: 'automatic',
  target: 'es2020',
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [plugin],
  outfile: path.join(here, 'out', 'essam-site.js'),
  logLevel: 'warning',
  metafile: true,
});
console.log('bytes', (await import('node:fs')).statSync(path.join(here, 'out', 'essam-site.js')).size);
console.log('errors', result.errors.length, 'warnings', result.warnings.length);
