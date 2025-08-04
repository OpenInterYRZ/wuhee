import { contextBridge, ipcRenderer } from 'electron';

// 定义 IPC 事件类型
export interface GameState {
  currentChapter: string;
  currentScene: string;
  dialogueIndex: number;
  characters: string[];
  background: string;
  gameData: any;
}

// 暴露给渲染进程的 API
const electronAPI = {
  // 存档相关
  saveGame: (gameState: GameState) => ipcRenderer.invoke('SAVE_GAME_PROGRESS', gameState),
  loadGame: () => ipcRenderer.invoke('LOAD_GAME_PROGRESS'),
  checkSaveExists: () => ipcRenderer.invoke('CHECK_SAVE_EXISTS'),

  // 设置相关
  saveSettings: (settings: any) => ipcRenderer.invoke('SAVE_SETTINGS', settings),
  loadSettings: () => ipcRenderer.invoke('LOAD_SETTINGS'),

  // 窗口控制
  minimizeWindow: () => ipcRenderer.invoke('MINIMIZE_WINDOW'),
  maximizeWindow: () => ipcRenderer.invoke('MAXIMIZE_WINDOW'),
  closeWindow: () => ipcRenderer.invoke('CLOSE_WINDOW'),

  // 资源文件读取
  readResourceFile: (filePath: string) => ipcRenderer.invoke('READ_RESOURCE_FILE', filePath),

  // 事件监听
  onGameProgressLoaded: (callback: (gameState: GameState) => void) => {
    ipcRenderer.on('GAME_PROGRESS_LOADED', (_, gameState) => callback(gameState));
  },

  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  }
};

// 将 API 暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// 类型声明，供 TypeScript 使用
declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}