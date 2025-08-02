import { useEffect, useCallback } from 'react';
import { gameEngine } from '../services/GameEngine';
import { useGameStore } from '../store/gameStore';

export const useGameEngine = () => {
  const gameStore = useGameStore();

  // 初始化游戏引擎
  const initializeEngine = useCallback(async () => {
    try {
      await gameEngine.initialize();
      console.log('Game engine initialized');
    } catch (error) {
      console.error('Failed to initialize game engine:', error);
    }
  }, []);

  // 开始新游戏
  const startNewGame = useCallback(async () => {
    try {
      await gameEngine.startNewGame();
      gameStore.startGame();
    } catch (error) {
      console.error('Failed to start new game:', error);
    }
  }, [gameStore]);

  // 继续游戏
  const continueGame = useCallback(async () => {
    try {
      await gameEngine.continueGame();
      gameStore.startGame();
    } catch (error) {
      console.error('Failed to continue game:', error);
    }
  }, [gameStore]);

  // 推进对话
  const nextEvent = useCallback(async () => {
    try {
      await gameEngine.nextEvent();
    } catch (error) {
      console.error('Failed to process next event:', error);
    }
  }, []);

  // 处理选择
  const makeChoice = useCallback(async (choiceId: string) => {
    try {
      await gameEngine.makeChoice(choiceId);
    } catch (error) {
      console.error('Failed to make choice:', error);
    }
  }, []);

  // 暂停游戏
  const pauseGame = useCallback(() => {
    gameEngine.pauseGame();
    gameStore.pauseGame();
  }, [gameStore]);

  // 恢复游戏
  const resumeGame = useCallback(() => {
    gameEngine.resumeGame();
    gameStore.resumeGame();
  }, [gameStore]);

  // 保存游戏
  const saveGame = useCallback(async () => {
    try {
      await gameEngine.saveGame();
    } catch (error) {
      console.error('Failed to save game:', error);
      throw error;
    }
  }, []);

  // 加载游戏
  const loadGame = useCallback(async () => {
    try {
      await gameEngine.loadGame();
    } catch (error) {
      console.error('Failed to load game:', error);
      throw error;
    }
  }, []);

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      // 注意：这里不调用 dispose，因为游戏引擎是单例
      // gameEngine.dispose();
    };
  }, []);

  return {
    initializeEngine,
    startNewGame,
    continueGame,
    nextEvent,
    makeChoice,
    pauseGame,
    resumeGame,
    saveGame,
    loadGame,
    engineState: gameEngine.getState()
  };
};

export default useGameEngine;