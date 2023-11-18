import { BrowserWindow, shell } from "electron";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function createWindow(): Promise<BrowserWindow> {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
    autoHideMenuBar: true,
    webPreferences: {
      preload: fileURLToPath(new URL("../preload/index.js", import.meta.url)),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
      spellcheck: false,
    },
  });

  /**
   * If the 'show' property of the BrowserWindow's constructor is omitted from the initialization options,
   * it then defaults to 'true'. This can cause flickering as the window loads the html content,
   * and it also has show problematic behaviour with the closing of the window.
   * Use `show: false` and listen to the  `ready-to-show` event to show the window.
   *
   * @see https://github.com/electron/electron/issues/25012 for the afford mentioned issue.
   */
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();

    if (import.meta.env.DEV) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  await (import.meta.env.DEV && process.env.ELECTRON_RENDERER_URL
    ? mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    : mainWindow.loadFile(resolve(dirname(fileURLToPath(import.meta.url)), "../renderer/index.html")));

  return mainWindow;
}

/**
 * Restore an existing BrowserWindow or Create a new BrowserWindow.
 */
export async function restoreOrCreateWindow(): Promise<void> {
  let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
