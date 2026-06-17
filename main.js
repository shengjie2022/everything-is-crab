import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 640,
    resizable: false,
    useContentSize: true,
    title: '蟹化进化',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.setMenu(null);
  win.loadFile('index.html');
  // F12 toggles DevTools
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') win.webContents.toggleDevTools();
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
