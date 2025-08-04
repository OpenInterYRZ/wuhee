import { ipcMain, BrowserWindow, app } from 'electron';
import { SaveLoadService } from './saveLoadService';
import { GameState } from '../preload';
import * as path from 'path';
import * as fs from 'fs';

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

    // 资源文件读取事件
    ipcMain.handle('READ_RESOURCE_FILE', async (_, filePath: string) => {
      return await this.readResourceFile(filePath);
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

  // 读取资源文件
  private async readResourceFile(filePath: string): Promise<string> {
    try {
      let resourcePath: string;

      if (app.isPackaged) {
        // 打包后的路径：从应用根目录的 public 文件夹读取
        resourcePath = path.join(process.resourcesPath, '..', 'public', filePath.replace(/^\//, ''));
      } else {
        // 开发环境：从项目的 public 文件夹读取
        resourcePath = path.join(__dirname, '../../public', filePath.replace(/^\//, ''));
      }

      console.log('Reading resource file from:', resourcePath);
      const content = await fs.promises.readFile(resourcePath, 'utf-8');
      return content;
    } catch (error) {
      console.error(`Failed to read resource file ${filePath}:`, error);
      throw new Error(`Failed to read resource file: ${filePath}`);
    }
  }
}