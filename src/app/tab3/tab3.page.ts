import { Component, OnInit } from '@angular/core';
import { MusicService } from '../services/music.service';
import { AlertController, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { add, navigate, play } from 'ionicons/icons';
import { ApiService, Song, Playlist } from '../services/api-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class Tab3Page implements OnInit {
  playlists: Playlist[] = [];
  selectedPlaylist: Playlist | null = null;
  songs: Song[] = [];
  showAddSongs = false;

  constructor(private musicService: MusicService, private alertController: AlertController, private ApiService: ApiService, private router : Router) {
    addIcons({ add });
  }

  ngOnInit() {
    this.ApiService.setUserId(1); // Cambia por el ID del usuario autenticado
    this.loadPlaylists();
    this.loadSongs();
  }

  loadPlaylists() {
    this.ApiService.getPlaylists().subscribe({
      next: (playlists) => {
        this.playlists = playlists.map(playlist => {
          return {
            id: playlist.id,
            nombre: playlist.nombre,
            imagen: playlist.imagen ? playlist.imagen : 'assets/cover/default-playlist.png', // Imagen por defecto
            canciones: playlist.canciones, // Si tiene canciones asociadas
          };
        });
      },
      error: (error) => console.error('Error cargando listas:', error),
    });
  }

  async loadSongs() {
    this.songs = await this.musicService.listSongs();
  }

  async createPlaylist() {
    const alert = await this.alertController.create({
      header: 'Nueva Lista de Reproducción',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de la lista',
        },
        {
          name: 'imagen',
          // type: 'file',
          // attributes: {
          //   accept: 'image/*',
          // },
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Crear',
          handler: async (data) => {
            if (!data.nombre) {
              return false;
            }
            // const input = document.querySelector('input[name="imagen"]') as HTMLInputElement;
            // const imagen = input.files?.[0];
            // let imagenPath: string | undefined;

            // if (imagen) {
            //   // imagenPath = await this.ApiService.savePlaylistImage(imagen);
            // }

            this.ApiService.createPlaylist(data.nombre).subscribe({
              next: (playlist) => {
                this.playlists.push({
                  ...playlist,
                  imagen: 'assets/cover/default-playlist.png', //|| imagenPath
                  canciones: [],
                });
              },
              error: (error) => console.error('Error creando lista:', error),
            });
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  selectPlaylist(playlist: Playlist) {
    this.selectedPlaylist = playlist;
    this.showAddSongs = false;
    //va a la pagina lista y le pasa los parametros de la playlist seleccionada
    this.router.navigate(["/lista"], {queryParams:{
      id: playlist.id,
      nombre: playlist.nombre,
      canciones: playlist.canciones,
      imagen: playlist.imagen
    }

    })

  }

  addSongToPlaylist(song: Song) {
    if (!this.selectedPlaylist || !song.id) {
      console.error('No se ha seleccionado una lista o la canción no tiene ID');
      return;
    }
    this.ApiService.addSongToPlaylist(this.selectedPlaylist.id, song.id).subscribe({
      next: (playlist) => {
        this.selectedPlaylist!.canciones.push(song);
        this.showAddSongs = false;
      },
      error: (error) => console.error('Error añadiendo canción:', error),
    });
  }
}
