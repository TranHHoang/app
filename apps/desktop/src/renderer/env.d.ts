/// <reference types="vite/client" />
import { ElectronApi } from "../shared/types";

declare global {
  interface Window {
    electronApi: ElectronApi;
  }
}
