const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');

const testMain = `
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createWindow() {
  const win = new BrowserWindow({
    width: 960, height: 640, show: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.webContents.on('console-message', (e, level, msg) => {
    if (level >= 2) console.log('[ERR] ' + msg.substring(0, 200));
  });

  await win.loadFile('index.html');
  console.log('[OK] Page loaded');

  // Click start
  await new Promise(r => setTimeout(r, 1000));
  await win.webContents.executeJavaScript("document.getElementById('btn-start').click()");
  console.log('[OK] Game started');

  // Wait for creatures to spawn and render
  await new Promise(r => setTimeout(r, 3000));

  // Take screenshot
  const img = await win.webContents.capturePage();
  const pngBuf = img.toPNG();
  const ssPath = path.join(__dirname, 'screenshot_game.png');
  const fsNode = await import('fs');
  fsNode.default.writeFileSync(ssPath, pngBuf);
  console.log('[OK] Screenshot saved: ' + ssPath + ' (' + pngBuf.length + ' bytes)');

  // Also log creature info
  const info = await win.webContents.executeJavaScript("JSON.stringify(window.game.creatures.filter(function(c){return !c.dead}).map(function(c){return c.form+'('+c.name+')'}))");
  console.log('[CREATURES] ' + info);

  app.quit();
}

app.whenReady().then(createWindow);
setTimeout(function() { app.quit(); }, 15000);
`;

fs.writeFileSync(path.join(__dirname, '_test_main.mjs'), testMain);

try {
  const result = execSync('"' + electronPath + '" _test_main.mjs --no-sandbox', {
    cwd: __dirname, timeout: 20000, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe']
  });
  console.log(result);
} catch(e) {
  if (e.stdout) console.log(e.stdout);
}

try { fs.unlinkSync(path.join(__dirname, '_test_main.mjs')); } catch(e) {}
