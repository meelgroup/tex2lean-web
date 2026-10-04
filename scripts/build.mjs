import { mkdir, copyFile } from 'node:fs/promises';
// Explicit allowlist: internal documentation never enters the Pages artifact.
const files = ['index.html', 'assets/styles.css', 'assets/main.js', 'assets/icon.svg'];
await mkdir('_site/assets', { recursive: true });
for (const file of files) await copyFile(file, `_site/${file}`);
await copyFile('.nojekyll', '_site/.nojekyll');
console.log(`Built ${files.length} public files into _site/`);
