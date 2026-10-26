import { mkdir, copyFile, readdir } from 'node:fs/promises';
import { dirname } from 'node:path';
// Explicit allowlist: internal documentation never enters the Pages artifact.
const files = [
  'index.html', 'tutorial.html', 'cli.html', 'assets/styles.css', 'assets/main.js',
  'assets/icon.svg', 'assets/tutorial.css', 'assets/tutorial.js',
];
for (const file of await readdir('assets/tutorial')) {
  if (file.endsWith('.png')) files.push(`assets/tutorial/${file}`);
}
for (const file of files) {
  await mkdir(dirname(`_site/${file}`), { recursive: true });
  await copyFile(file, `_site/${file}`);
}
await copyFile('.nojekyll', '_site/.nojekyll');
console.log(`Built ${files.length} public files into _site/`);
