import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { NativeAudio } from '@capacitor-community/native-audio';

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {
  private webAudio: HTMLAudioElement | null = null;
  private currentAssetId = 'current-song';

  async play(path: string) {
    if (Capacitor.getPlatform() === 'web') {
      this.webAudio?.pause();
      this.webAudio = new Audio(path);
      await this.webAudio.play();
    } else {
      try {
        await NativeAudio.unload({ assetId: this.currentAssetId }).catch(() => {});
        await NativeAudio.preload({
          assetId: this.currentAssetId,
          assetPath: encodeURI(path),
          isUrl: true
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
  }

  resume() {
    if (Capacitor.getPlatform() === 'web') {
      this.webAudio?.play();
    } else {
      NativeAudio.resume({ assetId: this.currentAssetId }).catch(console.error);
    }
  }

  stop() {
    if (Capacitor.getPlatform() === 'web') {
      this.webAudio?.pause();
      if (this.webAudio) this.webAudio.currentTime = 0;
    } else {
      NativeAudio.stop({ assetId: this.currentAssetId }).catch(console.error);
    }
  }

  seekTo(seconds: number) {
    if (Capacitor.getPlatform() === 'web' && this.webAudio) {
      this.webAudio.currentTime = seconds;
    }
  }

  async getCurrentTime(): Promise<number> {
    return Capacitor.getPlatform() === 'web' ? (this.webAudio?.currentTime || 0) : 0;
  }

  async getDuration(): Promise<number> {
    return Capacitor.getPlatform() === 'web' ? (this.webAudio?.duration || 0) : 0;
  }
}
