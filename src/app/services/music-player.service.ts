import { Injectable } from '@angular/core';
import { NativeAudio } from '@capacitor-community/native-audio';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {
  private currentAudioId = 'Music';

  constructor() {}

  // async playMusic(path: string) {

  //   if (Capacitor.isNativePlatform()) {
  //     try {
  //       await NativeAudio.unload({ assetId: this.currentAudioId });
  //     } catch (error) {
  //       //si no carga simplemente no hace nada
  //     }

  //     await NativeAudio.preload({
  //       assetId: this.currentAudioId,
  //       assetPath: path,
  //       isUrl: true
  //     });

  //     await NativeAudio.play({ assetId: this.currentAudioId });
  //   } else {
  //     const audio = new Audio(path);
  //     audio.play();
  //   }
  // }

  // async stopMusic() {
  //   if (Capacitor.isNativePlatform()) {
  //     await NativeAudio.stop({ assetId: this.currentAudioId });
  //     await NativeAudio.unload({ assetId: this.currentAudioId });
  //   } else {
  //     // Lógica para detener el audio en la web
  //   }
  // }
}
