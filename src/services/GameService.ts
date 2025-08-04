import type { GameState } from '../types'

export interface SceneData {
  id: string
  title: string
  background?: string
  music?: string
  events: GameEvent[]
}

export interface GameEvent {
  type: 'dialogue' | 'choice' | 'showCharacter' | 'hideCharacter' | 'bgchange' | 'playMusic' | 'playSfx' | 'end' | 'tanchuang'
  speaker?: string
  text?: string
  character?: string
  position?: 'left' | 'center' | 'right'
  background?: string
  tc?: string
  backgroundChange?: string // 对话事件中的背景切换
  effects?: {
    shake?: boolean
    fadeout?: boolean
    fadein?: boolean
    noEffect?: boolean
    duration?: number
    transition?: 'fade' | 'slide' | 'zoom'
  }
  music?: string
  sfx?: string
  choices?: Choice[]
  nextScene?: string
}

export interface Choice {
  id: string
  text: string
  nextScene?: string
  condition?: string
}

export interface CharacterData {
  id: string
  name: string
  color: string
  avatar?: string
}

class GameService {
  private static instance: GameService
  private charactersData: Record<string, CharacterData> = {}
  private currentScene: SceneData | null = null
  private currentEventIndex: number = 0

  private constructor() {
    this.loadCharactersData()
  }

  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService()
    }
    return GameService.instance
  }

  // 加载角色数据
  private async loadCharactersData(): Promise<void> {
    try {
      // 检查是否在Electron环境中
      let dataText: string;
      if (window.electronAPI && 'readResourceFile' in window.electronAPI) {
        // 在Electron环境中使用IPC读取
        dataText = await (window.electronAPI as any).readResourceFile('content/characters.json');
      } else {
        // 在Web环境中使用fetch
        const response = await fetch('/content/characters.json');
        dataText = await response.text();
      }
      const data = JSON.parse(dataText);
      // 处理 {characters: {...}} 格式的数据
      if (data.characters) {
        this.charactersData = Object.keys(data.characters).reduce((acc: Record<string, CharacterData>, charId: string) => {
          const char = data.characters[charId]
          acc[charId] = {
            id: charId,
            name: char.name,
            color: char.color,
            avatar: char.avatar,
          }
          return acc
        }, {})
      } else {
        // 处理数组格式的数据（向后兼容）
        this.charactersData = data.reduce((acc: Record<string, CharacterData>, char: CharacterData) => {
          acc[char.id] = char
          return acc
        }, {})
      }
    } catch (error) {
      console.error('Failed to load characters data:', error)
    }
  }

  // 加载场景数据
  public async loadScene(sceneId: string): Promise<SceneData | null> {
    try {
      // 处理场景ID格式：如果包含下划线则分割，否则直接使用
      let scenePath: string
      if (sceneId.includes('_')) {
        const [chapter, scene] = sceneId.split('_')
        scenePath = `/content/${chapter}/${scene}.json`
      } else {
        // 默认为第一章
        scenePath = `/content/chapter1/${sceneId}.json`
      }

      // 检查是否在Electron环境中
      let rawDataText: string;
      if (window.electronAPI && 'readResourceFile' in window.electronAPI) {
        // 在Electron环境中使用IPC读取
        rawDataText = await (window.electronAPI as any).readResourceFile(scenePath.replace(/^\//, ''));
      } else {
        // 在Web环境中使用fetch
        const response = await fetch(scenePath);
        rawDataText = await response.text();
      }
      const rawData = JSON.parse(rawDataText);

      // 转换新格式的场景数据
      let sceneData: SceneData
      console.log('🖼️ GameService: rawData', rawData)
      if (rawData.scene && rawData.script) {
        // 新格式：{scene: {...}, script: [...]}
        sceneData = {
          id: rawData.scene.id,
          title: rawData.scene.title,
          background: rawData.scene.background,
          music: rawData.scene.music,
          events: this.convertScriptToEvents(rawData.script),
        }
      } else {
        // 旧格式：直接使用
        sceneData = rawData
      }

      this.currentScene = sceneData
      this.currentEventIndex = 0
      return sceneData
    } catch (error) {
      console.error(`Failed to load scene ${sceneId}:`, error)
      return null
    }
  }

  // 转换脚本格式到事件格式
  private convertScriptToEvents(script: any[]): GameEvent[] {
    return script.map((item: any) => {
      switch (item.type) {
        case 'dialogue':
          return {
            type: 'dialogue' as const,
            speaker: item.speaker,
            text: item.text,
            backgroundChange: item.backgroundChange || item.background, // 支持 backgroundChange 和 background 字段
          }
        case 'choice':
          return {
            type: 'choice' as const,
            choices:
              item.options?.map((option: any, index: number) => ({
                id: `choice_${index}`,
                text: option.text,
                nextScene: option.next_scene,
              })) || [],
          }
        case 'character_show':
          return {
            type: 'showCharacter' as const,
            character: item.character,
            position: item.position,
          }
        case 'character_hide':
          return {
            type: 'hideCharacter' as const,
            character: item.character,
          }
        case 'bgchange':
          return {
            type: 'bgchange' as const,
            background: item.background,
            effects: item.effects,
          }
        case 'sound_effect':
          return {
            type: 'playSfx' as const,
            sfx: item.asset,
          }
        case 'tanchuang':
          return {
            type: 'tanchuang' as const,
            tc: item.tc,
          }
        default:
          // 对于不识别的类型，转换为对话事件
          return {
            type: 'dialogue' as const,
            speaker: 'narrator',
            text: item.text || '',
          }
      }
    })
  }

  // 获取当前事件
  public getCurrentEvent(): GameEvent | null {
    if (!this.currentScene || this.currentEventIndex >= this.currentScene.events.length) {
      return null
    }
    return this.currentScene.events[this.currentEventIndex]
  }

  // 推进到下一个事件
  public nextEvent(): GameEvent | null {
    if (!this.currentScene) return null

    this.currentEventIndex++
    return this.getCurrentEvent()
  }

  // 处理选择
  public handleChoice(choiceId: string): string | null {
    const currentEvent = this.getCurrentEvent()
    if (!currentEvent || currentEvent.type !== 'choice') {
      return null
    }

    const choice = currentEvent.choices?.find((c) => c.id === choiceId)
    if (!choice) {
      return null
    }

    // 如果选择有下一个场景，返回场景ID
    if (choice.nextScene) {
      return choice.nextScene
    }

    // 否则继续当前场景的下一个事件
    this.nextEvent()
    return null
  }

  // 获取角色信息
  public getCharacterInfo(characterId: string): CharacterData | null {
    return this.charactersData[characterId] || null
  }

  // 重置游戏状态
  public reset(): void {
    this.currentScene = null
    this.currentEventIndex = 0
  }

  // 获取当前场景进度
  public getSceneProgress(): { current: number; total: number } {
    if (!this.currentScene) {
      return { current: 0, total: 0 }
    }
    return {
      current: this.currentEventIndex,
      total: this.currentScene.events.length,
    }
  }

  // 跳转到指定事件
  public jumpToEvent(eventIndex: number): GameEvent | null {
    if (!this.currentScene || eventIndex < 0 || eventIndex >= this.currentScene.events.length) {
      return null
    }
    this.currentEventIndex = eventIndex
    return this.getCurrentEvent()
  }

  // 获取当前场景信息
  public getCurrentScene(): SceneData | null {
    return this.currentScene
  }

  // 检查是否到达场景结尾
  public isSceneEnd(): boolean {
    if (!this.currentScene) return true
    return this.currentEventIndex >= this.currentScene.events.length
  }
}

export const gameService = GameService.getInstance()
export default GameService
