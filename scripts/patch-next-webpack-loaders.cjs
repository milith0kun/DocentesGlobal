const fs = require('fs');
const path = require('path');

const loaders = [
  ['next-flight-action-entry-loader.js', 'nextFlightActionEntryLoader'],
  ['next-flight-client-entry-loader.js', 'transformSource'],
  ['next-flight-client-module-loader.js', 'flightClientModuleLoader'],
  ['next-flight-css-loader.js', 'NextServerCSSLoader'],
  ['next-flight-server-reference-proxy-loader.js', 'flightServerReferenceProxyLoader'],
];

const loaderDir = path.join(
  __dirname,
  '..',
  'node_modules',
  'next',
  'dist',
  'build',
  'webpack',
  'loaders'
);

for (const [fileName, exportName] of loaders) {
  const filePath = path.join(loaderDir, fileName);
  if (!fs.existsSync(filePath)) continue;

  const source = fs.readFileSync(filePath, 'utf8');
  if (source.includes('codex-direct-loader-export')) continue;
  if (!source.includes(exportName)) {
    throw new Error(`Expected ${exportName} in ${filePath}`);
  }

  fs.writeFileSync(
    filePath,
    `${source}

// codex-direct-loader-export: Webpack may import this CommonJS loader as ESM.
module.exports = ${exportName};
module.exports.default = ${exportName};
`
  );
}
