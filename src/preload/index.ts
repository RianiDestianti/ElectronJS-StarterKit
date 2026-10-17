import { contextBridge, ipcRenderer } from 'electron'

// Hanya fungsi yang dibutuhkan yang dibuka ke renderer (bukan seluruh ipcRenderer).
contextBridge.exposeInMainWorld('api', {
  token: {
    get     : () => ipcRenderer.invoke('token:get'),
    set     : (token: string) => ipcRenderer.invoke('token:set', token),
    remove  : () => ipcRenderer.invoke('token:remove'),
  },
})
