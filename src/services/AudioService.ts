class AudioService {
  private static instance: AudioService;
  private musicAudio: HTMLAudioElement | null = null;
  private sfxAudio: HTMLAudioElement | null = null;
  private currentMusic: string | null = null;
  private musicVolume: number = 0.7;
  private sfxVolume: number = 0.8;
  private masterVolume: number = 1.0;
  private isMuted: boolean = false;

  private constructor() {
    // 初始化音频对象
    this.musicAudio = new Audio();
    this.sfxAudio = new Audio();
    
    // 设置音频属性
    this.musicAudio.loop = true;
    this.musicAudio.preload = 'auto';
    this.sfxAudio.preload = 'auto';
    
    // 更新音量
    this.updateVolumes();
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  // 播放背景音乐
  public async playMusic(musicPath: string, fadeIn: boolean = true): Promise<void> {
    if (!this.musicAudio || this.currentMusic === musicPath) {
      return;
    }

    try {
      // 如果有正在播放的音乐，先淡出
      if (this.currentMusic && fadeIn) {
        await this.fadeOutMusic();
      } else {
        this.stopMusic();
      }

      // 加载新音乐
      this.musicAudio.src = `/assets/audio/music/${musicPath}`;
      this.currentMusic = musicPath;
      
      // 设置初始音量
      if (fadeIn) {
        this.musicAudio.volume = 0;
      } else {
        this.musicAudio.volume = this.getEffectiveMusicVolume();
      }

      // 播放音乐
      await this.musicAudio.play();
      
      // 淡入效果
      if (fadeIn) {
        await this.fadeInMusic();
      }
    } catch (error) {
      console.error('Failed to play music:', error);
    }
  }

  // 停止背景音乐
  public stopMusic(): void {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
      this.currentMusic = null;
    }
  }

  // 播放音效
  public async playSfx(sfxPath: string): Promise<void> {
    if (!this.sfxAudio) return;

    try {
      // 创建新的音频对象来播放音效（允许重叠播放）
      const sfxAudio = new Audio(`/assets/audio/sfx/${sfxPath}`);
      sfxAudio.volume = this.getEffectiveSfxVolume();
      await sfxAudio.play();
    } catch (error) {
      console.error('Failed to play SFX:', error);
    }
  }

  // 设置主音量
  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  // 设置音乐音量
  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  // 设置音效音量
  public setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  // 静音/取消静音
  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.updateVolumes();
  }

  // 获取当前音量设置
  public getVolumes(): { master: number; music: number; sfx: number } {
    return {
      master: this.masterVolume,
      music: this.musicVolume,
      sfx: this.sfxVolume
    };
  }

  // 获取静音状态
  public isMusicMuted(): boolean {
    return this.isMuted;
  }

  // 暂停音乐
  public pauseMusic(): void {
    if (this.musicAudio && !this.musicAudio.paused) {
      this.musicAudio.pause();
    }
  }

  // 恢复音乐
  public resumeMusic(): void {
    if (this.musicAudio && this.musicAudio.paused && this.currentMusic) {
      this.musicAudio.play().catch(error => {
        console.error('Failed to resume music:', error);
      });
    }
  }

  // 获取有效的音乐音量
  private getEffectiveMusicVolume(): number {
    return this.isMuted ? 0 : this.masterVolume * this.musicVolume;
  }

  // 获取有效的音效音量
  private getEffectiveSfxVolume(): number {
    return this.isMuted ? 0 : this.masterVolume * this.sfxVolume;
  }

  // 更新音量
  private updateVolumes(): void {
    if (this.musicAudio) {
      this.musicAudio.volume = this.getEffectiveMusicVolume();
    }
  }

  // 音乐淡入
  private async fadeInMusic(duration: number = 1000): Promise<void> {
    if (!this.musicAudio) return;

    const targetVolume = this.getEffectiveMusicVolume();
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = targetVolume / steps;

    for (let i = 0; i <= steps; i++) {
      this.musicAudio.volume = volumeStep * i;
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }

  // 音乐淡出
  private async fadeOutMusic(duration: number = 1000): Promise<void> {
    if (!this.musicAudio) return;

    const initialVolume = this.musicAudio.volume;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = initialVolume / steps;

    for (let i = steps; i >= 0; i--) {
      this.musicAudio.volume = volumeStep * i;
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }

  // 清理资源
  public dispose(): void {
    this.stopMusic();
    if (this.musicAudio) {
      this.musicAudio.src = '';
      this.musicAudio = null;
    }
    if (this.sfxAudio) {
      this.sfxAudio.src = '';
      this.sfxAudio = null;
    }
  }
}

export const audioService = AudioService.getInstance();
export default AudioService;