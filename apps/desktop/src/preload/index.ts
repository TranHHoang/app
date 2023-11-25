import { contextBridge, ipcRenderer } from "electron";
import { DIALOG_OPEN_TEXT_FILE, DIALOG_SAVE_TEXT_FILE } from "../shared/consts";
import { ElectronApi } from "../shared/types";

// Custom APIs for renderer
const electronApi: ElectronApi = {
  openTextFile: () => ipcRenderer.invoke(DIALOG_OPEN_TEXT_FILE),
  saveTextFile: (name, content) => ipcRenderer.invoke(DIALOG_SAVE_TEXT_FILE, name, content),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electronApi", electronApi);
  } catch (error) {
    console.error(error);
  }
}
