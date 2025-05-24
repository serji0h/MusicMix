import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { NativeAudio } from '@capacitor-community/native-audio';

@Injectable({
  providedIn: 'root',
})
export class MusicPlayerService {
  private webAudio: HTMLAudioElement | null = null;
  private currentAssetId = 'current-song';
  private currentPath: string | null = null;
  private startTime: number | null = null;
  private cachedDuration: number | null = null;
  private isPaused: boolean = false;

  async play(path: string, seekToSeconds: number = 0) {
    this.currentPath = path;
    this.startTime = Date.now() / 1000 - seekToSeconds;
    this.isPaused = false;

    if (Capacitor.getPlatform() === 'web') {
      this.webAudio?.pause();
      this.webAudio = new Audio(path);
      this.webAudio.currentTime = seekToSeconds;
      await this.webAudio.play();
      this.webAudio.onloadedmetadata = () => {
        this.cachedDuration = this.webAudio?.duration || 0;
      };
    } else {
      try {
        await NativeAudio.unload({ assetId: this.currentAssetId }).catch(() => {});
        await NativeAudio.preload({
          assetId: this.currentAssetId,
          assetPath: encodeURI(path),
          isUrl: true,
          audioChannelNum: 1,
        });
        await NativeAudio.play({ assetId: this.currentAssetId });
      } catch (e) {
        console.error('Error al reproducir en nativo:', e);
      }
    }
  }

  pause() {
    if (Capacitor.getPlatform() === 'web') {
      this.webAudio?.pause();
    } else {
      NativeAudio.pause({ assetId: this.currentAssetId }).catch(console.error);
    }
    this.isPaused = true;
  }

  resume() {
    if (Capacitor.getPlatform() === 'web') {
      this.webAudio?.play();
    } else {
      NativeAudio.resume({ assetId: this.currentAssetId }).catch(console.error);
    }
    if (this.startTime) {
      this.startTime = Date.now() / 1000 - (this.webAudio?.currentTime || this.getCurrentTimeSync());
    }
    this.isPaused = false;
  }

  async stop() {
    if (Capacitor.getPlatform() === 'web') {
      this.webAudio?.pause();
      if (this.webAudio) this.webAudio.currentTime = 0;
    } else {
      await NativeAudio.stop({ assetId: this.currentAssetId }).catch(console.error);
      await NativeAudio.unload({ assetId: this.currentAssetId }).catch(() => {});
    }
    this.startTime = null;
    this.cachedDuration = null;
    this.isPaused = false;
  }

  async seekTo(seconds: number) {
    if (Capacitor.getPlatform() === 'web' && this.webAudio) {
      this.webAudio.currentTime = seconds;
    } else {
      try {
        await NativeAudio.stop({ assetId: this.currentAssetId }).catch(() => {});
        await NativeAudio.unload({ assetId: this.currentAssetId }).catch(() => {});
        if (this.currentPath) {
          await this.play(this.currentPath, seconds);
          this.startTime = Date.now() / 1000 - seconds;
        }
      } catch (e) {
        console.error('Error en seekTo nativo:', e);
      }
    }
  }

  private getCurrentTimeSync(): number {
    if (this.startTime && !this.isPaused) {
      return Math.max(0, Date.now() / 1000 - this.startTime);
    }
    return 0;
  }

  async getCurrentTime(): Promise<number> {
    if (Capacitor.getPlatform() === 'web') {
      return this.webAudio?.currentTime || 0;
    } else {
      return this.getCurrentTimeSync();
    }
  }

  async getDuration(): Promise<number> {
    if (Capacitor.getPlatform() === 'web') {
      return this.webAudio?.duration || this.cachedDuration || 0;
    } else {
      if (this.cachedDuration !== null) {
        return this.cachedDuration;
      }
      try {
        const result = await NativeAudio.getDuration({
          assetId: this.currentAssetId,
        });
        this.cachedDuration = result.duration || 0;
        return this.cachedDuration;
      } catch (e) {
        console.error('Error en getDuration nativo:', e);
        return 0;
      }
    }
  }

  setDuration(duration: number) {
    this.cachedDuration = duration;
  }
}
