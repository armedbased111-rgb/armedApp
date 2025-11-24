import { contextBridge, ipcRenderer } from "electron";

// expose des APIs securisé au frontend
contextBridge.exposeInMainWorld('electronAPI', {
    getVersion: () => process.versions.electron,
    // communication ICP (a implanter)
    sendMessage: (
        channel: string,
        data: any,
    ) => {
        ipcRenderer.send(channel, data);
    },
    onMessage: (
        channel: string,
        callback: (data: any) => void
    ) => {
        ipcRenderer.on(channel, (event, data) => callback(data));
    }
});