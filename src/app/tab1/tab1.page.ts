import { CommonModule } from '@angular/common';
import { MusicService } from '../services/music.service';
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonThumbnail } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { ApiService, Song } from '../services/api-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonLabel, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, CommonModule, IonThumbnail],
})
export class Tab1Page {
  songs: Song[] = [];
  search: string = '';
  songsSearched: Song[] = [];
  isMobile: boolean = Capacitor.isNativePlatform();

  constructor(private musicService: MusicService, private apiService: ApiService, private router: Router) {}

  async ngOnInit() {
    this.songs = await this.musicService.listSongs();
    this.songsSearched = [...this.songs];
  }

  searchSongs(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.songsSearched = this.songs.filter((song) =>
      song.name.toLowerCase().includes(searchTerm)
    );
  }

  async getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        resolve(audio.duration || 0);
      };
      audio.onerror = () => {
        resolve(0);
      };
    });
  }

  async directorySelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    const audioFiles = files.filter((file: File) => file.type.startsWith('audio/'));

    this.songs = await Promise.all(
      audioFiles.map(async (file) => {
        const path = URL.createObjectURL(file);
        const duration = await this.getAudioDuration(file);

        // Extraer metadatos para enviar al backend
        const cleanName = file.name.replace(/\.(mp3|wav|flac)$/, '');
        const parts = cleanName.split(' - ');
        const title = parts.length === 2 ? parts[1].trim() : cleanName.trim();
        const artist = parts.length === 2 ? parts[0].trim() : 'Unknown Artist';
        const album = 'Unknown Album';

        // Enviar la canción al backend (solo para almacenarla)
        try {
          await this.apiService.createOrGetSong(title, artist, album).toPromise();
        } catch (error) {
          console.error(`Error enviando ${file.name} al backend:`, error);
        }

        return {
          name: file.name,
          path,
          duration,
        };
      })
    );

    this.songsSearched = [...this.songs];
    this.musicService.setWebSongs(this.songs);
  }

  openPlayer(song: Song) {
    this.router.navigate(['/music-player'], {
      queryParams: {
        name: song.name,
        path: song.path,
        duration: song.duration || 0,
      },
    });
  }
}
