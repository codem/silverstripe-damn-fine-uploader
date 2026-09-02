#!/usr/bin/env bun
/**
 * Bundles the Uppy frontend (client/src) into client/dist using Bun's bundler,
 * writes an SRI-hashed assets manifest, and syncs the hashes used by
 * Requirements::javascript()/css() in src/Fields/UppyField.php.
 */
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = import.meta.dir;
const ENTRY = path.join(ROOT, 'client/src/js/uppy.js');
const DIST = path.join(ROOT, 'client/dist');
const MANIFEST = path.join(DIST, 'assets-manifest.json');
const UPPY_FIELD = path.join(ROOT, 'src/Fields/UppyField.php');

async function build(minify, suffix) {
  const result = await Bun.build({
    entrypoints: [ENTRY],
    outdir: DIST,
    minify,
    sourcemap: 'linked',
    target: 'browser',
    naming: `js/[name]${suffix}.[ext]`,
  });

  if (!result.success) {
    for (const log of result.logs) console.error(log.toString());
    throw new Error('build failed');
  }

  // CSS pulled in via `import '...css'` lands next to the JS output; move it
  // into styles/ to match the layout SilverStripe Requirements expects.
  const paths = [];
  for (const output of result.outputs) {
    if (output.kind === 'asset') {
      const dest = output.path.replace(`${path.sep}js${path.sep}`, `${path.sep}styles${path.sep}`);
      await mkdir(path.dirname(dest), { recursive: true });
      await rename(output.path, dest);
      paths.push(dest);
    } else {
      paths.push(output.path);
    }
  }
  return paths;
}

async function integrityOf(filePath) {
  const bytes = await Bun.file(filePath).arrayBuffer();
  const digest = new Bun.CryptoHasher('sha384').update(bytes).digest('base64');
  return { integrity: `sha384-${digest}`, size: bytes.byteLength };
}

function patchIntegrity(content, resourcePath, integrity) {
  const pattern = new RegExp(
    `(${resourcePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?"integrity"\\s*=>\\s*")sha384-[A-Za-z0-9+/=]+(")`
  );
  if (!pattern.test(content)) {
    throw new Error(`could not find integrity attribute for ${resourcePath} in ${UPPY_FIELD}`);
  }
  return content.replace(pattern, `$1${integrity}$2`);
}

await rm(DIST, { recursive: true, force: true });

const outputPaths = [
  ...(await build(false, '')),
  ...(await build(true, '.min')),
];

const manifest = {};
for (const filePath of outputPaths) {
  const name = path.relative(DIST, filePath).split(path.sep).pop();
  const { integrity, size } = await integrityOf(filePath);
  manifest[name] = { src: path.relative(DIST, filePath).split(path.sep).join('/'), integrity };
  console.log(`${name}\t${size}b\t${integrity}`);
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

let phpSource = await Bun.file(UPPY_FIELD).text();
phpSource = patchIntegrity(phpSource, 'client/dist/js/uppy.min.js', manifest['uppy.min.js'].integrity);
phpSource = patchIntegrity(phpSource, 'client/dist/styles/uppy.min.css', manifest['uppy.min.css'].integrity);
await writeFile(UPPY_FIELD, phpSource);

console.log(`\nWrote ${Object.keys(manifest).length} assets, updated integrity hashes in ${path.relative(ROOT, UPPY_FIELD)}`);
