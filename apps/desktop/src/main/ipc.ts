import { dialog, ipcMain } from "electron";
import { readFile, writeFile } from "node:fs/promises";
import { DIALOG_OPEN_TEXT_FILE, DIALOG_SAVE_TEXT_FILE } from "../shared/consts";
import { ElectronApi } from "../shared/types";

export function registerIpcHandles(): void {
  ipcMain.handle(DIALOG_OPEN_TEXT_FILE, handleOpenTextFile);
  ipcMain.handle(DIALOG_SAVE_TEXT_FILE, (_, name: string | null, content: string) => handleSaveTextFile(name, content));
}

async function handleOpenTextFile(): ReturnType<ElectronApi["openTextFile"]> {
  const { filePaths } = await dialog.showOpenDialog({ properties: ["openFile"] });
  const [filePath] = filePaths;

  if (!filePath) return null;

  const content = await readFile(filePath, { encoding: "utf8" });
  return { name: filePath, content };
}

async function handleSaveTextFile(name: string | null, content: string): ReturnType<ElectronApi["saveTextFile"]> {
  let fileName: string | null = name;
  if (!fileName) {
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: "Untitled.html",
      filters: [
        {
          name: "HTML",
          extensions: ["html"],
        },
      ],
    });
    if (!filePath) return null;
    fileName = filePath;
  }
  await writeFile(fileName, content);
  return fileName;
}
