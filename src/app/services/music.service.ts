import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { NativeAudio } from '@capacitor-community/native-audio';

export interface Song {
  name: string;
  path: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  songsWeb: Song[] = [];

  constructor() {}

  async listSongs(): Promise<Song[]> {
    if (Capacitor.isNativePlatform()) {
      return this.getMusicFiles();
    } else {
      return this.songsWeb;
    }
  }

  async getMusicFiles(): Promise<Song[]> {
    try {
      const result = await Filesystem.readdir({
        directory: Directory.ExternalStorage,
        path: 'Music',
      });

      const files = await Promise.all(
        result.files
          .filter((file: any) =>
            file.name && (file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.flac'))
          )
          .map(async (file: any) => {
            const fileUri = `file:///storage/emulated/0/Music/${file.name}`;
            const assetId = `song-${file.name}`;
            let duration = 0;

            if (Capacitor.isNativePlatform()) {
              try {
                await NativeAudio.preload({
                  assetId,
                  assetPath: encodeURI(fileUri),
                  isUrl: true,
                  audioChannelNum: 1,
                });
                const durationResult = await NativeAudio.getDuration({
                  assetId,
                });
                duration = durationResult.duration || 0;
                await NativeAudio.unload({ assetId }).catch(() => {});
              } catch (e) {
                console.error(`Error obteniendo duración para ${file.name}:`, e);
              }
            }

            return {
              name: file.name,
              path: fileUri,
              duration,
            };
          })
      );

      return files;
    } catch (error) {
      console.error('Error leyendo directorio (External):', error);
      return [];
    }
  }

  setWebSongs(songs: Song[]) {
    this.songsWeb = songs;
  }
}
