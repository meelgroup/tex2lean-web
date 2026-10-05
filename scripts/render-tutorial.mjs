/** Generate tutorial PNGs using the extension's actual sidebar renderer.
 * Usage: node scripts/render-tutorial.mjs --playwright /path/to/playwright/index.mjs
 * Requires ../formalize-everything (with esbuild installed) and ../esa22-copy.
 * No extension or run source is copied into the public build.
 */
import { mkdtempSync, readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
const flag = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`);
  return at >= 0 ? process.argv[at + 1] : fallback;
};
const root = path.resolve(flag('extension', '../formalize-everything'));
const run = path.resolve(flag('run', '../esa22-copy'));
const output = path.resolve('assets/tutorial');
const only = flag('only', '');
const { build } = await import(pathToFileURL(path.join(root, 'node_modules/esbuild/lib/main.js')));
const { chromium } = await import(pathToFileURL(path.resolve(flag('playwright', '/private/tmp/tex2lean-browser/node_modules/playwright/index.mjs'))));
const work = mkdtempSync(path.join(tmpdir(), 'tex2lean-tutorial-'));
process.on('exit', () => rmSync(work, { recursive: true, force: true }));
const stubVscode = {
  name: "stub-vscode",
  setup(b) {
    b.onResolve({ filter: /^vscode$/ }, () => ({ path: "vscode", namespace: "stub" }));
    b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
      contents: `
        const noop = () => {};
        export const Uri = {
          joinPath: (...p) => ({ fsPath: p.join("/"), path: p.join("/") }),
          file: (p) => ({ fsPath: p, path: p }),
        };
        export const workspace = {
          fs: { readFile: async () => new Uint8Array(), writeFile: async () => {} },
          getConfiguration: () => ({ get: () => undefined, update: async () => {} }),
          workspaceFolders: [],
          onDidChangeConfiguration: () => ({ dispose: noop }),
        };
        export const window = {
          createOutputChannel: () => new Proxy({}, { get: () => noop }),
          showInformationMessage: async () => undefined,
          showErrorMessage: async () => undefined,
        };
        export const commands = { executeCommand: async () => undefined };
        export const version = "1.106.0";
        export class EventEmitter {
          constructor() { this.event = () => ({ dispose: noop }); }
          fire() {} dispose() {}
        }
        export const ViewColumn = { One: 1 };
        export const ConfigurationTarget = { Global: 1, Workspace: 2 };
      `,
      loader: "js",
    }));
  },
};

const THEME = `
:root {
  --vscode-font-family: -apple-system, "Segoe UI", system-ui, sans-serif;
  --vscode-font-size: 13px;
  --vscode-editor-font-family: "SF Mono", Menlo, Consolas, monospace;
  --vscode-foreground: #cccccc;
  --vscode-descriptionForeground: #9d9d9d;
  --vscode-sideBar-background: #181818;
  --vscode-editor-background: #1f1f1f;
  --vscode-panel-border: #2b2b2b;
  --vscode-widget-border: #2b2b2b;
  --vscode-button-background: #0078d4;
  --vscode-button-foreground: #ffffff;
  --vscode-button-hoverBackground: #026ec1;
  --vscode-button-secondaryBackground: #313131;
  --vscode-button-secondaryForeground: #cccccc;
  --vscode-textLink-foreground: #4daafc;
  --vscode-inputValidation-warningBorder: #cca700;
  --vscode-inputValidation-errorBorder: #be1100;
  --vscode-list-hoverBackground: #2a2d2e;
  --vscode-input-background: #313131;
  --vscode-input-foreground: #cccccc;
  --vscode-input-border: #3c3c3c;
  --vscode-focusBorder: #0078d4;
  --vscode-charts-green: #89d185;
  --vscode-charts-red: #f14c4c;
  --vscode-charts-yellow: #cca700;
}
html, body {
  width: var(--mw); height: var(--mh);
  margin: 0; padding: 0;
  background: var(--vscode-sideBar-background);
  color: var(--vscode-foreground);
  font-family: var(--vscode-font-family);
  font-size: var(--vscode-font-size);
}
`;


const bundle = path.join(work, 'model.mjs');
await build({ stdin: { contents: `export * from ${JSON.stringify(path.join(root, 'scripts/mock-entry.ts'))};
    export { askAboutRestate } from ${JSON.stringify(path.join(root, 'src/analysis/recovery/statementDrift.ts'))};`,
    resolveDir: root, loader: 'ts' }, bundle: true,
  format: 'esm', platform: 'node', outfile: bundle, plugins: [stubVscode], logLevel: 'error' });
const M = await import(pathToFileURL(bundle));
const host = M.createMemoryHost();
host.chosen.project.set('agents.count', 6);
M.installHost(host);
const checkpoint = JSON.parse(readFileSync(path.join(run, '.blueprint/run/thm-main-2b14xc/checkpoint.json')));
const blueprint = JSON.parse(readFileSync(path.join(run, '.blueprint/thm-main-5e5f26eaeb/blueprint.json')));
const target = blueprint.bundle.target;
const status = JSON.parse(readFileSync(path.join(run, '.blueprint/status.json')));
class Capture extends M.SidebarProvider { draw(model) { this.lastModel = model; } }
const make = async (connected = true, scanned = true) => {
  const p = new Capture({ fsPath: '/ext', path: '/ext' },
    async () => ({ connected, label: connected ? 'Claude Code' : 'Not connected', models: { current: 'default', choices: [{ id: 'default', label: 'Provider default' }] } }),
    () => {}, () => {}, { get: (_, fallback) => fallback, update: async () => {}, keys: () => [], set: async () => {} });
  if (scanned) p.setState({ origin: 'latex', rootLabel: 'esa22-final.tex',
    targets: Object.values(status.nodes).map((node, i) => ({
      id: node.label === 'thm:main' ? target.id : `t${i + 20}`,
      kind: node.detail || 'claim', environment: node.detail || 'claim',
      label: node.label, title: node.label === 'thm:main' ? 'Distinct elements in a stream' : undefined,
      start: node.start || { file: 'esa22-final.tex', line: Number(node.location.split(':').pop()) },
      end: node.end || { file: 'esa22-final.tex', line: Number(node.location.split(':').pop()) },
      sectionPath: ['A Simple Algorithm', 'Theoretical Analysis'], body: ''
    })) });
  p.noteCheckpointsRead(); await p.refreshConnection(); return p;
};
const goal = { targetKey: 'label:thm:main', kind: 'Theorem', title: 'Distinct elements in a stream',
  titleIsSuggested: true, label: 'thm:main', location: 'esa22-final.tex:501',
  capstone: 'Esa22Copy.esa22copy_main' };
const scenes = [];
scenes.push({ name: 'connect', p: await make(false, false) });
scenes.push({ name: 'select', p: await make() });
scenes.push({ name: 'pick', p: await make(), picking: true });
const settings = await make(); scenes.push({ name: 'settings', p: settings, settings: true });
const review = await make(); review.setGoal(goal);
const card = M.statementCard(goal.capstone,
  blueprint.filePlan.files.filter(f => f.role === 'audit-surface'),
  'Esa22Copy/Model/Theorem.lean', [], 'esa22-final.tex:501', true);
void review.requestChoice({ id: 'proveEarly', label: card.label, hint: card.hint, options: [],
  declines: 'check-first', holdsWith: 'check-first', actions: [
    { id: 'trust', label: 'Start proving' }, { id: 'check-first', label: 'I want to edit it first' }] });
await new Promise(resolve => setTimeout(resolve, 0));
scenes.push({ name: 'review', p: review });
const proving = await make(); proving.setGoal(goal); proving.setRunning(true);
proving.setBusy('Proving thm:main', 'Working on the Lean proof', true, true);
scenes.push({ name: 'proving', p: proving });
// A hypothetical proposal, generated through the actual restatement prompt.
const restating = await make(true, false);
restating.setState({ origin: 'latex', rootLabel: 'example.tex', targets: [{
  id: 'example', kind: 'theorem', environment: 'theorem',
  title: 'Space bound (example)', label: 'example:space', body: '',
  start: { file: 'example.tex', line: 42 },
  end: { file: 'example.tex', line: 44 }, sectionPath: ['Space analysis']
}] });
restating.setRunning(true);
restating.setGoal({ targetKey: 'label:example:space', kind: 'Theorem',
  title: 'Space bound (example)', titleIsSuggested: false,
  label: 'example:space', location: 'example.tex:42',
  capstone: 'Example.space_bound' });
void M.askAboutRestate(restating, [{ name: 'Example.space_bound',
  file: 'Example/Model/Theorem.lean',
  why: 'The proposed logarithmic space bound needs a lower bound on the universe size n.',
  suggested: 'Add the hypothesis n ≥ 2 to the space-bound theorem.' }]);
await new Promise(resolve => setTimeout(resolve, 0));
scenes.push({ name: 'restate', p: restating, draft: 'Add the hypothesis n ≥ 2 to the space-bound theorem.' });

const paused = await make(); paused.setGoal(goal);
paused.setResumable({ slug: checkpoint.slug, targetKey: 'label:thm:main', label: 'thm:main', note: 'Continue from the saved checkpoint' });
scenes.push({ name: 'resume', p: paused });
const css = readFileSync(path.join(root, 'media/sidebar.css'), 'utf8');
const js = readFileSync(path.join(root, 'media/sidebar.js'), 'utf8');
const browser = await chromium.launch({ executablePath: flag('chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'), headless: true, args: ['--disable-gpu'] });
mkdirSync(output, { recursive: true });
const records = [];
const errors = [];
try {
  for (const scene of scenes.filter(scene => !only || scene.name === only)) {
    const height = { connect: 300, select: 560, settings: 1050, review: 950, proving: 400, resume: 650, pick: 580, restate: 660 }[scene.name];
    const page = await browser.newPage({ viewport: { width: 420, height }, deviceScaleFactor: 2 });
    page.on('pageerror', error => errors.push(error.message));
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}${THEME}
      html,body { width:420px; height:${height}px; --mw:420px; --mh:${height}px; }</style></head><body><div id="app"></div>
      <script>window.__TEX2LEAN_REGIONS__=${JSON.stringify(M.REGIONS)};
      window.acquireVsCodeApi=()=>({postMessage:()=>{},getState:()=>undefined,setState:()=>{}});</script>
      <script>${js}</script><script>window.postMessage({type:'state',model:${JSON.stringify(scene.p.lastModel)}},'*');</script></body></html>`);
    await page.waitForTimeout(100);
    if (scene.picking) {
      await page.getByRole('button', { name: 'Formalize several…', exact: true }).click();
      await page.locator('input[type=checkbox]').first().check();
      await page.waitForTimeout(100);
    }
    if (scene.settings) {
      await page.getByRole('button', { name: 'Settings', exact: true }).click();
      await page.waitForTimeout(100);
    }

    if (scene.draft) await page.locator('textarea.choice-input').fill(scene.draft);
    const controls = await page.locator('button,a,input,select,textarea').evaluateAll(nodes => nodes.map(n => {
      const r = n.getBoundingClientRect();
      return { text: n.textContent.trim(), label: n.getAttribute('aria-label'), title: n.title,
        x: r.x, y: r.y, width: r.width, height: r.height };
    }).filter(n => n.width && n.height));
    await page.screenshot({ path: path.join(output, `${scene.name}.png`), fullPage: false });
    records.push({ name: scene.name, width: 420, height: Math.max(240, height), controls });
    await page.close();
  }
  if (!only || only === 'chat') {
  const page = await browser.newPage({ viewport: { width: 620, height: 620 }, deviceScaleFactor: 2 });
  page.on('pageerror', error => errors.push(error.message));
  const scaffold = readFileSync(path.join(root, 'src/ui/chatPanel.ts'), 'utf8').split('<body>')[1].split('<script nonce=')[0];
  const chatCss = readFileSync(path.join(root, 'media/chat.css'), 'utf8');
  const markdown = readFileSync(path.join(root, 'media/chatMarkdown.js'), 'utf8');
  const chatJs = readFileSync(path.join(root, 'media/chat.js'), 'utf8');
  await page.setContent(`<!doctype html><html><head><style>${THEME}${chatCss}
    html,body { width:620px; height:620px; }</style></head><body>${scaffold}
    <script>window.acquireVsCodeApi=()=>({postMessage:()=>{},getState:()=>undefined,setState:()=>{}});</script>
    <script>${markdown}</script><script>${chatJs}</script>
    <script>window.postMessage({type:'state',model:${JSON.stringify(paused.lastModel)}},'*');</script></body></html>`);
  await page.getByRole('button', { name: 'Understand the proof', exact: true }).click();
  const controls = await page.locator('button,textarea').evaluateAll(nodes => nodes.map(n => {
    const r = n.getBoundingClientRect();
    return { text: n.textContent.trim(), label: n.getAttribute('aria-label'), title: n.title,
      x: r.x, y: r.y, width: r.width, height: r.height };
  }).filter(n => n.width && n.height));
  await page.screenshot({ path: path.join(output, 'chat.png') });
  records.push({ name: 'chat', width: 620, height: 620, controls });
  await page.close();
  }
} finally { await browser.close(); }
if (errors.length) throw new Error(errors.join('\n'));
const previous = only ? JSON.parse(readFileSync(path.join(output, 'controls.json'), 'utf8')) : [];
const merged = [...previous.filter(record => !records.some(next => next.name === record.name)), ...records];
writeFileSync(path.join(output, 'controls.json'), JSON.stringify(merged, null, 2));
console.log(JSON.stringify(records, null, 2));
