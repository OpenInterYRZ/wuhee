// 全局类型声明
import type { GameState, GameSettings } from './index';

interface ElectronAPI {
  // 游戏存档相关
  saveGame: (gameState: GameState) => Promise<void>;
  loadGame: () => Promise<GameState>;
  deleteSave: () => Promise<void>;
  checkSaveExists: () => Promise<boolean>;

  // 设置相关
  saveSettings: (settings: GameSettings) => Promise<void>;
  loadSettings: () => Promise<GameSettings>;

  // 窗口控制
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;

  // 资源文件读取
  readResourceFile: (filePath: string) => Promise<string>;

  // 事件监听
  onWindowEvent: (callback: (event: string) => void) => void;
  removeAllListeners: (channel: string) => void;
}

// 扩展 Window 接口
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export { };