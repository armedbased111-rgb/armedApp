export interface ElectronAPI {
  getVersion: () => string;
  sendMessage: (channel: string, data: any) => void;
  onMessage: (channel: string, callback: (data: any) => void) => void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
};