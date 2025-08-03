import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { GameState, GameSettings, GameProgress, Choice } from '../types'

// 游戏动作接口
interface GameActions {
  // 对话控制
  advanceDialogue: () => void
  // 对话控制
  setDialogue: (dialogue: string, speaker: string) => void
  setCurrentDialogue: (dialogue: string) => void
  setCurrentSpeaker: (speaker: string) => void
  setCurrentChoices: (choices: Choice[]) => void

  // 角色和背景
  setCharacters: (characters: string[]) => void
  setBackground: (background: string) => void
  setPendingBackgroundChange: (background: string) => void
  applyPendingBackgroundChange: () => void
  setCurrentScene: (scene: string) => void
  showCharacter: (character: string, position?: string) => void
  hideCharacter: (character: string) => void

  // 游戏进度
  setGameProgress: (scene: string, eventIndex: number) => void
  updateProgress: (progress: Partial<GameProgress>) => void

  // 游戏控制
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  setLoading: (loading: boolean) => void

  // 存档系统
  saveGame: () => Promise<void>
  loadGame: () => Promise<void>

  // 设置
  updateSettings: (settings: Partial<GameState['settings']>) => void

  // 重置游戏
  resetGame: () => void

  // 初始化
  initializeGame: () => Promise<void>
}

// 默认状态
const defaultState: GameState = {
  currentScene: 'scene01',
  currentEventIndex: 0,
  currentDialogue: '',
  currentSpeaker: '',
  characters: [],
  background: '',
  pendingBackgroundChange: '', // 待切换的背景
  currentChoices: [],
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  settings: {
    volume: {
      master: 0.8,
      music: 0.7,
      sfx: 0.8,
    },
    display: {
      fullscreen: false,
      textSpeed: 50,
    },
  },
  progress: {
    completedScenes: [],
    unlockedContent: [],
    playTime: 0,
    lastSaveTime: 0,
  },
}

// 创建游戏状态管理器
export const useGameStore = create<GameState & GameActions>()(
  devtools(
    (set, get) => ({
      ...defaultState,

      // 对话控制
      advanceDialogue: () => {
        const state = get()
        set({ currentEventIndex: state.currentEventIndex + 1 })
        // TODO: 这里需要加载下一段对话的逻辑
      },

      setDialogue: (dialogue: string, speaker: string) => {
        set({ currentDialogue: dialogue, currentSpeaker: speaker })
      },

      setCurrentDialogue: (dialogue: string) => {
        set({ currentDialogue: dialogue })
      },

      setCurrentSpeaker: (speaker: string) => {
        set({ currentSpeaker: speaker })
      },

      setCurrentChoices: (choices: Choice[]) => {
        set({ currentChoices: choices })
      },

      // 角色和背景
      setCharacters: (characters: string[]) => {
        set({ characters })
      },

      setBackground: (background: string) => {
        console.log('🖼️ GameStore: setting background to', background)
        set({ background })
      },

      setPendingBackgroundChange: (background: string) => {
        set({ pendingBackgroundChange: background })
      },

      applyPendingBackgroundChange: () => {
        const { pendingBackgroundChange } = get()
        if (pendingBackgroundChange) {
          set({ background: pendingBackgroundChange, pendingBackgroundChange: '' })
        }
      },

      setCurrentScene: (scene: string) => {
        set({ currentScene: scene })
      },

      showCharacter: (character: string, position?: string) => {
        const currentCharacters = get().characters
        if (!currentCharacters.includes(character)) {
          set({ characters: [...currentCharacters, character] })
        }
      },

      hideCharacter: (character: string) => {
        const currentCharacters = get().characters
        set({ characters: currentCharacters.filter((c) => c !== character) })
      },

      // 游戏进度
      setGameProgress: (scene: string, eventIndex: number) => {
        set({ currentScene: scene, currentEventIndex: eventIndex })
      },

      updateProgress: (newProgress: Partial<GameProgress>) => {
        const currentProgress = get().progress
        set({ progress: { ...currentProgress, ...newProgress } })
      },

      // 游戏控制
      startGame: () => {
        set({ isPlaying: true, isPaused: false })
      },

      pauseGame: () => {
        set({ isPaused: true })
      },

      resumeGame: () => {
        set({ isPaused: false })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      // 存档系统
      saveGame: async () => {
        try {
          if (typeof window !== 'undefined' && window.electronAPI) {
            const state = get()
            const gameState: GameState = {
              currentScene: state.currentScene,
              currentEventIndex: state.currentEventIndex,
              currentDialogue: state.currentDialogue,
              currentSpeaker: state.currentSpeaker,
              currentChoices: state.currentChoices,
              background: state.background,
              characters: state.characters,
              isPlaying: state.isPlaying,
              isPaused: state.isPaused,
              isLoading: state.isLoading,
              settings: state.settings,
              progress: state.progress,
            }

            await window.electronAPI.saveGame(gameState)
            console.log('Game saved successfully')
          }
        } catch (error) {
          console.error('Failed to save game:', error)
        }
      },

      loadGame: async () => {
        if (window.electronAPI) {
          try {
            set({ isLoading: true })
            const gameState = await window.electronAPI.loadGame()

            if (gameState) {
              set({
                currentScene: gameState.currentScene,
                currentEventIndex: gameState.currentEventIndex,
                characters: gameState.characters,
                background: gameState.background,
                progress: gameState.progress,
                isPlaying: true,
              })
              console.log('Game loaded successfully')
            }
          } catch (error) {
            console.error('Failed to load game:', error)
          } finally {
            set({ isLoading: false })
          }
        }
      },

      // 设置
      updateSettings: (newSettings) => {
        const currentSettings = get().settings
        const updatedSettings = {
          ...currentSettings,
          ...newSettings,
          volume: { ...currentSettings.volume, ...newSettings.volume },
          display: { ...currentSettings.display, ...newSettings.display },
        }

        set({ settings: updatedSettings })

        // 保存设置到本地
        if (window.electronAPI) {
          window.electronAPI.saveSettings(updatedSettings)
        }
      },

      // 重置游戏
      resetGame: () => {
        set({
          ...defaultState,
          settings: get().settings, // 保留设置
        })
      },

      // 初始化
      initializeGame: async () => {
        if (window.electronAPI) {
          try {
            // 加载设置
            const settings = await window.electronAPI.loadSettings()
            if (settings) {
              set({ settings })
            }

            console.log('Game initialized successfully')
          } catch (error) {
            console.error('Failed to initialize game:', error)
          }
        }
      },
    }),
    {
      name: 'game-store',
    }
  )
)
