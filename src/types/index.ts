// 导出所有类型定义
export * from './global';

// 游戏相关类型
export interface SceneEvent {
  type: 'dialogue' | 'choice' | 'showCharacter' | 'hideCharacter' | 'changeBackground' | 'playMusic' | 'playSfx' | 'end';
  speaker?: string;
  text?: string;
  character?: string;
  position?: 'left' | 'center' | 'right';
  background?: string;
  music?: string;
  sfx?: string;
  choices?: Choice[];
  nextScene?: string;
}

export interface SceneData {
  id: string;
  title: string;
  background?: string;
  music?: string;
  events: SceneEvent[];
}

export interface CharacterData {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

export interface Choice {
  id: string;
  text: string;
  nextScene?: string;
  condition?: string;
}

export interface GameState {
  currentScene: string;
  currentEventIndex: number;
  currentDialogue: string;
  currentSpeaker: string;
  currentChoices: Choice[];
  background: string;
  characters: string[];
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  settings: GameSettings;
  progress: GameProgress;
}

export interface GameSettings {
  volume: {
    master: number;
    music: number;
    sfx: number;
  };
  display: {
    fullscreen: boolean;
    textSpeed: number;
  };
}

export interface GameProgress {
  completedScenes: string[];
  unlockedContent: string[];
  playTime: number;
  lastSaveTime: number;
}