

import * as esbuild from 'esbuild'

let result = await esbuild.context({
  entryPoints: ['src/index.js'],
  bundle: true,
  outdir: 'dist',
 
})

await result.watch()