import { app } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';
import { GameState } from '../preload';

export class SaveLoadService {
  private userDataPath: string;
  private savesDir: string;
  private settingsDir: string;

  constructor() {
    this.userDataPath = app.getPath('userData');
    this.savesDir = path.join(this.userDataPath, 'saves');
    this.settingsDir = path.join(this.userDataPath, 'settings');
    this.initializeDirectories();
  }

  private async initializeDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.savesDir, { recursive: true });
      await fs.mkdir(this.settingsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create directories:', error);
    }
  }

  async saveGameProgress(gameState: GameState): Promise<boolean> {
    try {
      const saveFilePath = path.join(this.savesDir, 'autosave.json');
      const saveData = {
        ...gameState,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      
      await fs.writeFile(saveFilePath, JSON.stringify(saveData, null, 2), 'utf-8');
      console.log('Game progress saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to save game progress:', error);
      return false;
    }
  }

  async loadGameProgress(): Promise<GameState | null> {
    try {
      const saveFilePath = path.join(this.savesDir, 'autosave.json');
      const saveData = await fs.readFile(saveFilePath, 'utf-8');
      const gameState = JSON.parse(saveData);
      
      console.log('Game progress loaded successfully');
      return gameState;
    } catch (error) {
      console.error('Failed to load game progress:', error);
      return null;
    }
  }

  async checkSaveExists(): Promise<boolean> {
    try {
      const saveFilePath = path.join(this.savesDir, 'autosave.json');
      await fs.access(saveFilePath);
      return true;
    } catch {
      return false;
    }
  }

  async saveSettings(settings: any): Promise<boolean> {
    try {
      const settingsFilePath = path.join(this.settingsDir, 'settings.json');
      const settingsData = {
        ...settings,
        timestamp: new Date().toISOString()
      };
      
      await fs.writeFile(settingsFilePath, JSON.stringify(settingsData, null, 2), 'utf-8');
      console.log('Settings saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }

  async loadSettings(): Promise<any | null> {
    try {
      const settingsFilePath = path.join(this.settingsDir, 'settings.json');
      const settingsData = await fs.readFile(settingsFilePath, 'utf-8');
      const settings = JSON.parse(settingsData);
      
      console.log('Settings loaded successfully');
      return settings;
    } catch (error) {
      console.error('Failed to load settings:', error);
      // 返回默认设置
      return {
        volume: {
          master: 0.8,
          music: 0.7,
          sfx: 0.8
        },
        display: {
          fullscreen: false,
          textSpeed: 50
        }
      };
    }
  }

  async deleteSave(): Promise<boolean> {
    try {
      const saveFilePath = path.join(this.savesDir, 'autosave.json');
      await fs.unlink(saveFilePath);
      console.log('Save file deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete save file:', error);
      return false;
    }
  }
}