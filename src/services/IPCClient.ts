// IPC 客户端 - 封装与 Electron 主进程的通信
import type { GameState, GameSettings } from '../types';

export class IPCClient {
  private static instance: IPCClient;
  
  private constructor() {
    // 私有构造函数，实现单例模式
  }
  
  public static getInstance(): IPCClient {
    if (!IPCClient.instance) {
      IPCClient.instance = new IPCClient();
    }
    return IPCClient.instance;
  }
  
  // 检查是否为 Electron 环境
  private isElectronAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.electronAPI;
  }
  
  // 保存游戏
  async saveGame(gameState: GameState): Promise<boolean> {
    if (!this.isElectronAvailable()) {
      console.warn('Electron API not available');
      return false;
    }
    
    try {
      await window.electronAPI.saveGame(gameState);
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }
  
  async loadGame(): Promise<GameState | null> {
    if (!this.isElectronAvailable()) {
      console.warn('Electron API not available');
      return null;
    }
    
    try {
      return await window.electronAPI.loadGame();
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }
  
  async checkSaveExists(): Promise<boolean> {
    if (!this.isElectronAvailable()) {
      console.warn('Electron API not available');
      return false;
    }
    
    try {
      return await window.electronAPI.checkSaveExists();
    } catch (error) {
      console.error('Failed to check save exists:', error);
      return false;
    }
  }
  
  // 保存设置
  async saveSettings(settings: GameSettings): Promise<boolean> {
    if (!this.isElectronAvailable()) {
      console.warn('Electron API not available');
      return false;
    }
    
    try {
      await window.electronAPI.saveSettings(settings);
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }
  
  async loadSettings(): Promise<any | null> {
    if (!this.isElectronAvailable()) {
      console.warn('Electron API not available');
      return null;
    }
    
    try {
      return await window.electronAPI.loadSettings();
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  }
  
  // 窗口控制方法
  async minimizeWindow(): Promise<void> {
    if (!this.isElectronAvailable()) {
      console.warn('Electron API not available');
      return;
    }
    
    try {
      await window.electronAPI.minimizeWindow();
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  }
  
  async maximizeWindow(): Promise<void> {
    if (!this.isElectronAvailable()) {
      console.warn('Electron API not available');
      return;
    }
    
    try {
      await window.electronAPI.maximizeWindow();
    } catch (error) {
      console.error('Failed to maximize window:', error);
    }
  }
  
  async closeWindow(): Promise<void> {
    if (!this.isElectronAvailable()) {
      console.warn('Electron API not available');
      return;
    }
    
    try {
      await window.electronAPI.closeWindow();
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  }
  
  // 事件监听方法
  onWindowEvent(callback: (event: string) => void): void {
    if (!this.isElectronAvailable()) {
      console.warn('Electron API not available');
      return;
    }
    
    window.electronAPI.onWindowEvent(callback);
  }
  
  removeAllListeners(channel: string): void {
    if (!this.isElectronAvailable()) {
      console.warn('Electron API not available');
      return;
    }
    
    window.electronAPI.removeAllListeners(channel);
  }
}

// 导出单例实例
export const ipcClient = IPCClient.getInstance();