import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));

if (!existsSync(viteBin)) {
  console.error('ERRO: Vite nao esta instalado. Execute INICIAR_SITE.bat para reparar as dependencias.');
  process.exit(1);
}

const child = spawn(process.execPath, [viteBin, '--host', 'localhost', '--port', '5530', '--strictPort'], {
  cwd: process.cwd(),
  stdio: ['inherit', 'pipe', 'pipe'],
  windowsHide: false,
});

let opened = false;
const openSite = (url) => {
  if (opened) return;
  opened = true;
  console.log(`\nSITE:  ${url}`);
  console.log(`ADMIN: ${url.replace(/\/$/, '')}/admin\n`);

  if (process.platform === 'win32') {
    spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
  } else if (process.platform === 'darwin') {
    spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
  } else {
    spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
  }
};

const parse = (line) => {
  const match = line.match(/Local:\s+(https?:\/\/(?:localhost|127\.0\.0\.1):5530\/?)/i);
  if (match) openSite(match[1]);
};

const stdout = createInterface({ input: child.stdout });
stdout.on('line', (line) => {
  console.log(line);
  parse(line);
});

const stderr = createInterface({ input: child.stderr });
stderr.on('line', (line) => console.error(line));

child.on('exit', (code) => process.exit(code ?? 0));
process.on('SIGINT', () => child.kill('SIGINT'));
