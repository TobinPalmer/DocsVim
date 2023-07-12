// import * as esbuild from 'esbuild'
import esbuild from 'esbuild'

import { minifyTemplates, writeFiles } from 'esbuild-minify-templates'
import { copy } from 'esbuild-plugin-copy'
import eslint from 'esbuild-plugin-eslint'

const production = process.argv.includes('--build')
const watch = process.argv.includes('--watch')

const ctx = await esbuild.context({
  banner: { js: '//DocsVim - https://github.com/TobinPalmer/DocsVim' },
  minify: production,
  bundle: true,
  entryPoints: ['./src/ts/main.ts'],
  logLevel: 'info',
  outfile: 'dist/main.js',
  sourcemap: !production,
  treeShaking: true,
  drop: production ? ['debugger', 'console'] : [],
  plugins: [
    eslint({
      fix: false,
    }),
    minifyTemplates(),
    writeFiles(),
    copy({
      resolveFrom: 'cwd',
      assets: { from: ['./manifest.json'], to: ['./dist/manifest.json'] },
      watch: true,
    }),
  ],
})

if (watch) {
  await ctx.watch()
}
