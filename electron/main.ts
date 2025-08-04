import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { SaveLoadService } from './services/saveLoadService';
import { IPCHandler } from './services/ipcHandler';

class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      titleBarStyle: 'default',
      show: false,
    });

    // 开发环境加载 Vite 开发服务器
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools();
    } else {
      // 生产环境加载打包后的文件
      if (app.isPackaged) {
        // 打包后的路径：从 dist/electron/main.js 到 dist/index.html
        this.mainWindow.loadFile(path.join(__dirname, '../index.html'));
      } else {
        // 开发构建后的路径：从 dist/electron/main.js 到项目根目录的 dist/index.html
        this.mainWindow.loadFile(path.join(__dirname, '../index.html'));
      }
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
}

class App {
  private windowManager: WindowManager;
  private saveLoadService: SaveLoadService;
  private ipcHandler: IPCHandler;

  constructor() {
    this.windowManager = new WindowManager();
    this.saveLoadService = new SaveLoadService();
    this.ipcHandler = new IPCHandler(this.saveLoadService);
  }

  async initialize(): Promise<void> {
    await app.whenReady();
    this.windowManager.createWindow();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.windowManager.createWindow();
      }
    });
  }
}

// 启动应用
const gameApp = new App();
gameApp.initialize().catch(console.error);