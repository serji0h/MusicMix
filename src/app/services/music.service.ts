import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';


@Injectable({
  providedIn: 'root',
})
export class MusicService {
  songsWeb: string[] = [];
  constructor() { }

async listSongs(): Promise<string[]> {
    if(Capacitor.isNativePlatform()){
      return this.getMusicFiles();
    }else{
      return this.songsWeb;
    }
  }

  // async getMusicFiles(): Promise<string[]> {
  //   try {
  //     const result = await Filesystem.readdir({
  //       directory: Directory.External,
  //       path: 'Music',
  //     });
  //     return result.files
  //     .filter(file => typeof file === 'string' && ((file as string).endsWith('.mp3') || (file as string).endsWith('.wav') || (file as string).endsWith('.flac')))
  //     .map(file => `Music/${file}`);

  //   }
  //   catch (error) {
  //     console.error('Error leyendo directorio:', error);
  //     return [];
  //   }
  // }

  // addSongsWeb(files:FileList){
  //   //this.songsWeb.push(nombre);
  //   for (const file of Array.from(files)) {
  //     this.songsWeb.push(file.name);
  //   }

  // }


  async getMusicFiles(): Promise<any[]> {
    try {
      const result = await Filesystem.readdir({
        directory: Directory.ExternalStorage, // También probaremos otra opción
        path: 'Music',
      });

      return result.files;
    } catch (error) {
      console.error('Error leyendo directorio (External):', error);
      return [];
    }
  }


}
