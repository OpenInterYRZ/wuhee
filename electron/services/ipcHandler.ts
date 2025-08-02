import { ipcMain, BrowserWindow } from 'electron';
import { SaveLoadService } from './saveLoadService';
import { GameState } from '../preload';

export class IPCHandler {
  private saveLoadService: SaveLoadService;

  constructor(saveLoadService: SaveLoadService) {
    this.saveLoadService = saveLoadService;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // 存档相关事件
    ipcMain.handle('SAVE_GAME_PROGRESS', async (_, gameState: GameState) => {
      return await this.saveLoadService.saveGameProgress(gameState);
    });

    ipcMain.handle('LOAD_GAME_PROGRESS', async () => {
      return await this.saveLoadService.loadGameProgress();
    });

    ipcMain.handle('CHECK_SAVE_EXISTS', async () => {
      return await this.saveLoadService.checkSaveExists();
    });

    // 设置相关事件
    ipcMain.handle('SAVE_SETTINGS', async (_, settings: any) => {
      return await this.saveLoadService.saveSettings(settings);
    });

    ipcMain.handle('LOAD_SETTINGS', async () => {
      return await this.saveLoadService.loadSettings();
    });

    // 窗口控制事件
    ipcMain.handle('MINIMIZE_WINDOW', (event) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      window?.minimize();
    });

    ipcMain.handle('MAXIMIZE_WINDOW', (event) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      if (window?.isMaximized()) {
        window.unmaximize();
      } else {
        window?.maximize();
      }
    });

    ipcMain.handle('CLOSE_WINDOW', (event) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      window?.close();
    });

    // 删除存档事件
    ipcMain.handle('DELETE_SAVE', async () => {
      return await this.saveLoadService.deleteSave();
    });

    console.log('IPC event handlers registered successfully');
  }

  // 向渲染进程发送事件
  sendToRenderer(channel: string, data?: any): void {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach(window => {
      window.webContents.send(channel, data);
    });
  }

  // 广播游戏进度加载完成事件
  broadcastGameProgressLoaded(gameState: GameState): void {
    this.sendToRenderer('GAME_PROGRESS_LOADED', gameState);
  }
}