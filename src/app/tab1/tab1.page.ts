import { addIcons} from 'ionicons';
import { CommonModule } from '@angular/common';
import { MusicService } from '../services/music.service';
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonThumbnail, IonButton, IonIcon, ActionSheetController } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { ApiService, Song, Playlist } from '../services/api-service.service';
import { addCircleOutline } from 'ionicons/icons';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonIcon, IonLabel, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, CommonModule, IonThumbnail],
})
export class Tab1Page {
  songs: Song[] = [];
  playlists: Playlist[] = [];
  search: string = '';
  songsSearched: Song[] = [];
  isMobile: boolean = Capacitor.isNativePlatform();

  constructor(private musicService: MusicService, private apiService: ApiService, private router: Router, public actionSheetCtrl: ActionSheetController, private ApiService: ApiService) {
    addIcons({addCircleOutline})
  }

  async ngOnInit() {
    this.songs = await this.musicService.listSongs();
    //copia las canciones obtenidas a la lista de canciones buscadas
    this.songsSearched = this.songs;
  }

  searchSongs(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.songsSearched = this.songs.filter((song) =>
      song.nombre.toLowerCase().includes(searchTerm)
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

        //extrae datos del nombre para enviar al backend
        const cleanName = file.name.replace(/\.(mp3|wav|flac)$/, '');
        const parts = cleanName.split(' - ');
        const title = parts.length === 2 ? parts[1].trim() : cleanName.trim();
        const artist = parts.length === 2 ? parts[0].trim() : 'Unknown Artist';
        const album = 'Unknown Album';
        let songId: number | undefined;
        //envia la canción al backend (solo para almacenarla)
        try {
          const response = await this.apiService.createOrGetSong(title, artist, album).toPromise();
          songId = response.id;
        } catch (error) {
          console.error(`Error enviando ${file.name} al backend:`, error);
        }

        return {
          id: songId,
          nombre: file.name,
          path,
          duration,
          title,
          artist,
          album
        };
      })
    );

    this.songsSearched = this.songs;
    this.apiService.setDirectorySongs(this.songsSearched);
    this.musicService.setWebSongs(this.songs);
  }

  openPlayer(song: Song) {
    this.router.navigate(['/music-player'], {
      queryParams: {
        nombre: song.nombre,
        path: song.path,
        duration: song.duration || 0,
      },
    });
  }


  async presentActionSheet(song: Song) {
    await this.loadPlaylists(); //se espera a cargar las listas de reproduccion para luego mostrar lo siguente

    const buttons: Array<{ text: string; handler?: () => void; role?: string }> = this.playlists.map((playlist) => ({
      text: playlist.nombre, //nombre de la lista como texto del botón
      handler: () => {
        console.log(`Seleccionaste la lista: ${playlist.nombre}`);
        this.apiService.addSongToPlaylist(playlist.id, song.id!).subscribe({
          next: (updatedPlaylist) => {
            console.log(`Canción añadida a la lista: ${playlist.nombre}`);
            console.log('Lista actualizada:', updatedPlaylist);
          },
          error: (error) => {
            console.error(`Error añadiendo la canción a la lista ${playlist.nombre}:`, error);
          },
        });
      },
    }));

    buttons.push({
      text: 'Cancelar',
      role: 'cancel',
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Elige un Álbum:',
      buttons: buttons, //usa las listas como botones
    });

    await actionSheet.present();
  }

  async loadPlaylists(): Promise<void> {
    this.ApiService.getUserId();
    return new Promise((resolve, reject) => {
      this.ApiService.getPlaylists().subscribe({
        next: (playlists) => {
          this.playlists = playlists.map(playlist => ({
            id: playlist.id,
            nombre: playlist.nombre,
            imagen: playlist.imagen ? playlist.imagen : 'assets/cover/default-playlist.png',
            canciones: playlist.canciones,
          }));
          resolve(); //resuelve la promise si las listas se cargan bien
        },
        error: (error) => {
          console.error('Error cargando listas:', error);
          reject(error); //rechaza el promise si hay errores
        },
      });
    });
  }
}
