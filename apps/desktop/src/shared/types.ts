export interface ElectronApi {
  openTextFile: () => Promise<TextFile | null>;
  saveTextFile: (name: string | null, content: string) => Promise<string | null>;
}

export interface TextFile {
  name: string;
  content: string;
}
