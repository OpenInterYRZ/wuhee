import { gameService, GameEvent, SceneData } from './GameService';
import { audioService } from './AudioService';
import { useGameStore } from '../store/gameStore';

export interface GameEngineState {
  isInitialized: boolean;
  currentScene: string | null;
  isPlaying: boolean;
  isPaused: boolean;
}

class GameEngine {
  private static instance: GameEngine;
  private state: GameEngineState;
  private gameStore: any;

  private constructor() {
    this.state = {
      isInitialized: false,
      currentScene: null,
      isPlaying: false,
      isPaused: false
    };
  }

  public static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  // 初始化游戏引擎
  public async initialize(): Promise<void> {
    try {
      // 获取游戏状态管理
      this.gameStore = useGameStore.getState();
      
      // 初始化音频服务
      const settings = this.gameStore.settings;
      audioService.setMasterVolume(settings.volume.master);
      audioService.setMusicVolume(settings.volume.music);
      audioService.setSfxVolume(settings.volume.sfx);
      
      this.state.isInitialized = true;
      console.log('Game engine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize game engine:', error);
      throw error;
    }
  }

  // 开始新游戏
  public async startNewGame(): Promise<void> {
    if (!this.state.isInitialized) {
      await this.initialize();
    }

    try {
      // 重置游戏状态
      gameService.reset();
      this.gameStore.resetGame();
      
      // 加载第一个场景
      await this.loadScene('chapter1_scene01');
      
      this.state.isPlaying = true;
      this.state.isPaused = false;
      
      console.log('New game started');
    } catch (error) {
      console.error('Failed to start new game:', error);
      throw error;
    }
  }

  // 继续游戏
  public async continueGame(): Promise<void> {
    if (!this.state.isInitialized) {
      await this.initialize();
    }

    try {
      // 从存档加载游戏状态
      await this.gameStore.loadGame('autosave');
      
      const gameState = this.gameStore;
      if (gameState.currentScene) {
        await this.loadScene(gameState.currentScene);
        // 跳转到保存的事件位置
        gameService.jumpToEvent(gameState.currentEventIndex || 0);
      }
      
      this.state.isPlaying = true;
      this.state.isPaused = false;
      
      console.log('Game continued from save');
    } catch (error) {
      console.error('Failed to continue game:', error);
      throw error;
    }
  }

  // 加载场景
  public async loadScene(sceneId: string): Promise<void> {
    try {
      const sceneData = await gameService.loadScene(sceneId);
      if (!sceneData) {
        throw new Error(`Failed to load scene: ${sceneId}`);
      }

      this.state.currentScene = sceneId;
      this.gameStore.setCurrentScene(sceneId);
      
      // 设置场景背景
      if (sceneData.background) {
        this.gameStore.setBackground(sceneData.background);
      }
      
      // 播放场景音乐
      if (sceneData.music) {
        await audioService.playMusic(sceneData.music);
      }
      
      // 开始处理第一个事件
      await this.processCurrentEvent();
      
      console.log(`Scene loaded: ${sceneId}`);
    } catch (error) {
      console.error(`Failed to load scene ${sceneId}:`, error);
      throw error;
    }
  }

  // 处理当前事件
  public async processCurrentEvent(): Promise<void> {
    const currentEvent = gameService.getCurrentEvent();
    if (!currentEvent) {
      // 场景结束
      await this.handleSceneEnd();
      return;
    }

    await this.executeEvent(currentEvent);
  }

  // 执行事件
  private async executeEvent(event: GameEvent): Promise<void> {
    switch (event.type) {
      case 'dialogue':
        this.handleDialogue(event);
        break;
      case 'choice':
        this.handleChoice(event);
        break;
      case 'showCharacter':
        this.handleShowCharacter(event);
        break;
      case 'hideCharacter':
        this.handleHideCharacter(event);
        break;
      case 'changeBackground':
        this.handleChangeBackground(event);
        break;
      case 'playMusic':
        await this.handlePlayMusic(event);
        break;
      case 'playSfx':
        await this.handlePlaySfx(event);
        break;
      case 'end':
        await this.handleGameEnd();
        break;
      default:
        console.warn(`Unknown event type: ${event.type}`);
    }
  }

  // 处理对话事件
  private handleDialogue(event: GameEvent): void {
    this.gameStore.setCurrentDialogue(event.text || '');
    this.gameStore.setCurrentSpeaker(event.speaker || 'narrator');
  }

  // 处理选择事件
  private handleChoice(event: GameEvent): void {
    if (event.choices) {
      this.gameStore.setCurrentChoices(event.choices);
    }
  }

  // 处理显示角色事件
  private handleShowCharacter(event: GameEvent): void {
    if (event.character) {
      this.gameStore.showCharacter(event.character, event.position || 'center');
    }
  }

  // 处理隐藏角色事件
  private handleHideCharacter(event: GameEvent): void {
    if (event.character) {
      this.gameStore.hideCharacter(event.character);
    }
  }

  // 处理背景变更事件
  private handleChangeBackground(event: GameEvent): void {
    if (event.background) {
      this.gameStore.setBackground(event.background);
    }
  }

  // 处理音乐播放事件
  private async handlePlayMusic(event: GameEvent): Promise<void> {
    if (event.music) {
      await audioService.playMusic(event.music);
    }
  }

  // 处理音效播放事件
  private async handlePlaySfx(event: GameEvent): Promise<void> {
    if (event.sfx) {
      await audioService.playSfx(event.sfx);
    }
  }

  // 推进到下一个事件
  public async nextEvent(): Promise<void> {
    if (!this.state.isPlaying || this.state.isPaused) {
      return;
    }

    const nextEvent = gameService.nextEvent();
    if (nextEvent) {
      await this.executeEvent(nextEvent);
    } else {
      await this.handleSceneEnd();
    }
  }

  // 处理用户选择
  public async makeChoice(choiceId: string): Promise<void> {
    const nextSceneId = gameService.handleChoice(choiceId);
    
    if (nextSceneId) {
      // 跳转到新场景
      await this.loadScene(nextSceneId);
    } else {
      // 继续当前场景
      await this.processCurrentEvent();
    }
    
    // 清除选择菜单
    this.gameStore.setCurrentChoices([]);
  }

  // 处理场景结束
  private async handleSceneEnd(): Promise<void> {
    console.log('Scene ended');
    // 这里可以添加场景结束的逻辑，比如自动保存、跳转到下一章等
    await this.gameStore.saveGame('autosave');
  }

  // 处理游戏结束
  private async handleGameEnd(): Promise<void> {
    console.log('Game ended');
    this.state.isPlaying = false;
    // 这里可以添加游戏结束的逻辑，比如显示结局、返回主菜单等
  }

  // 暂停游戏
  public pauseGame(): void {
    this.state.isPaused = true;
    audioService.pauseMusic();
  }

  // 恢复游戏
  public resumeGame(): void {
    this.state.isPaused = false;
    audioService.resumeMusic();
  }

  // 保存游戏
  public async saveGame(): Promise<void> {
    try {
      const progress = gameService.getSceneProgress();
      this.gameStore.setGameProgress(this.state.currentScene || '', progress.current);
      await this.gameStore.saveGame();
      console.log('Game saved');
    } catch (error) {
      console.error('Failed to save game:', error);
      throw error;
    }
  }

  // 加载游戏
  public async loadGame(): Promise<void> {
    try {
      await this.gameStore.loadGame();
      const gameState = this.gameStore;
      
      if (gameState.currentScene) {
        await this.loadScene(gameState.currentScene);
        gameService.jumpToEvent(gameState.currentEventIndex || 0);
      }
      
      this.state.isPlaying = true;
      this.state.isPaused = false;
      
      console.log('Game loaded successfully');
    } catch (error) {
      console.error('Failed to load game:', error);
      throw error;
    }
  }

  // 获取引擎状态
  public getState(): GameEngineState {
    return { ...this.state };
  }

  // 清理资源
  public dispose(): void {
    audioService.dispose();
    gameService.reset();
    this.state = {
      isInitialized: false,
      currentScene: null,
      isPlaying: false,
      isPaused: false
    };
  }
}

export const gameEngine = GameEngine.getInstance();
export default GameEngine;