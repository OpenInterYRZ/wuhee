import { useEffect, useCallback } from 'react';
import { audioService } from '../services/AudioService';
import { useGameStore } from '../store/gameStore';

export const useAudio = () => {
  const { settings, updateSettings } = useGameStore();

  // 初始化音频设置
  useEffect(() => {
    audioService.setMasterVolume(settings.volume.master);
    audioService.setMusicVolume(settings.volume.music);
    audioService.setSfxVolume(settings.volume.sfx);
  }, [settings.volume]);

  // 播放背景音乐
  const playMusic = useCallback(async (musicPath: string, fadeIn: boolean = true) => {
    try {
      await audioService.playMusic(musicPath, fadeIn);
    } catch (error) {
      console.error('Failed to play music:', error);
    }
  }, []);

  // 停止背景音乐
  const stopMusic = useCallback(() => {
    audioService.stopMusic();
  }, []);

  // 播放音效
  const playSfx = useCallback(async (sfxPath: string) => {
    try {
      await audioService.playSfx(sfxPath);
    } catch (error) {
      console.error('Failed to play SFX:', error);
    }
  }, []);

  // 设置主音量
  const setMasterVolume = useCallback((volume: number) => {
    audioService.setMasterVolume(volume);
    updateSettings({
      volume: {
        ...settings.volume,
        master: volume
      }
    });
  }, [settings.volume, updateSettings]);

  // 设置音乐音量
  const setMusicVolume = useCallback((volume: number) => {
    audioService.setMusicVolume(volume);
    updateSettings({
      volume: {
        ...settings.volume,
        music: volume
      }
    });
  }, [settings.volume, updateSettings]);

  // 设置音效音量
  const setSfxVolume = useCallback((volume: number) => {
    audioService.setSfxVolume(volume);
    updateSettings({
      volume: {
        ...settings.volume,
        sfx: volume
      }
    });
  }, [settings.volume, updateSettings]);

  // 静音/取消静音
  const toggleMute = useCallback(() => {
    const isMuted = audioService.isMusicMuted();
    audioService.setMuted(!isMuted);
  }, []);

  // 暂停音乐
  const pauseMusic = useCallback(() => {
    audioService.pauseMusic();
  }, []);

  // 恢复音乐
  const resumeMusic = useCallback(() => {
    audioService.resumeMusic();
  }, []);

  // 获取当前音量设置
  const getVolumes = useCallback(() => {
    return audioService.getVolumes();
  }, []);

  // 获取静音状态
  const isMuted = useCallback(() => {
    return audioService.isMusicMuted();
  }, []);

  return {
    playMusic,
    stopMusic,
    playSfx,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    toggleMute,
    pauseMusic,
    resumeMusic,
    getVolumes,
    isMuted
  };
};

export default useAudio;