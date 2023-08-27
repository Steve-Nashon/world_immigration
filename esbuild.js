import esbuild from 'esbuild';


esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: 'dist/bundle.js'
}).catch(() => process.exit(1))