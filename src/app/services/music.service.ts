import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { NativeAudio } from '@capacitor-community/native-audio';
import { ApiService, Song, Playlist } from './api-service.service';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  songsWeb: Song[] = [];
  private userId: number | null = null;
  private PlaylistsWeb: Playlist[] = [];

  constructor(private apiService: ApiService) {}

  // Nuevo método para recibir el userId desde LoginPage
  setUserId(userId: number) {
    this.userId = userId;
    this.apiService.setUserId(userId); //pasa el id al apiservice
  }

  async listSongs(): Promise<Song[]> {
    if (Capacitor.isNativePlatform()) {
      return this.getMusicFiles();
    } else {
      return this.songsWeb;
    }
  }

  async getMusicFiles(): Promise<Song[]> {
    if (!this.userId) {
      console.warn('Usuario no autenticado, algunas funciones pueden no estar disponibles');
    }
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
            const assetId = `song-${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
            let duration = 0;

            if (Capacitor.isNativePlatform()) {
              try {
                await NativeAudio.preload({
                  assetId,
                  assetPath: encodeURI(fileUri),//para que no se rompa el formato, que si no se lia con los espacios
                  isUrl: true,
                  audioChannelNum: 1,
                });
                const durationResult = await NativeAudio.getDuration({assetId});
                duration = durationResult.duration || 0;
                await NativeAudio.unload({ assetId }).catch(() => {});
              } catch (e) {
                console.error(`Error obteniendo duración para ${file.name}:`, e);
                duration = 0; //si falla se pone a 0
              }
            }
            //extrae datos del nombre
            const { title, artist } = this.extractMetadataFromName(file.name);
            //como no consigo obtener el album, se pone un valor por defecto
            const album = 'Unknown Album';
            let songId: number | undefined;

            try {
              const response = await this.apiService.createOrGetSong(title, artist, album).toPromise();
              songId = response.id; //asigna el id de la cancion para usarlo luego en el listado
            } catch (error) {
              console.error(`el titulo es este ${title} con artista ${artist}`);
              console.error(`Error enviando ${file.name} al backend:`, error);
            }
            return {
              id: songId,
              nombre: file.name,
              path: fileUri,
              duration,
              title,
              artist,
              album,
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

  private extractMetadataFromName(fileName: string): { title: string, artist: string } {
    const cleanName = fileName.replace(/\.(mp3|wav|flac)$/, '');
    const parts = cleanName.split(' - ');

    if (parts.length === 2) {
      return {
        artist: parts[0].trim(),
        title: parts[1].trim(),
      };
    } else {
      return {
        artist: 'Unknown Artist',
        title: cleanName.trim(),
      };
    }
  }
}
