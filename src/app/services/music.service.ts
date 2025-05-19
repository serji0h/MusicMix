import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

export interface Song {
  name: string;
  path: string;
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
            const fileUri = `file:///storage/emulated/0/Music/${file.name}`; // Ruta absoluta
            return {
              name: file.name,
              path: fileUri
            };
          })
      );

      return files;
    } catch (error) {
      console.error('Error leyendo directorio (External):', error);
      return [];
    }
  }

}
