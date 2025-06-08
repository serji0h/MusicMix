import { Component, OnInit } from '@angular/core';
import { MusicService } from '../services/music.service';
import { AlertController, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonToast } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { ApiService, Song, Playlist } from '../services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonToast]
})
export class Tab3Page implements OnInit {
  playlists: Playlist[] = [];
  selectedPlaylist: Playlist | null = null;
  songs: Song[] = [];
  showAddSongs = false;
  mensaje: string = '';

  constructor(
    private musicService: MusicService,
    private alertController: AlertController,
    private apiService: ApiService,
    private router: Router
  ) {
    addIcons({ add });
  }

  ngOnInit() {
    // No seteamos userId hardcoded
    this.checkUserAndLoadPlaylists();
  }

  private checkUserAndLoadPlaylists() {
    // Verifica si hay un userId en ApiService
    try {
      this.loadPlaylists();
    } catch (error) {
      console.error('Usuario no autenticado:', error);
      this.mensaje = 'Por favor, inicia sesión';
      this.router.navigate(['/login']);
    }
  }

  private loadPlaylists() {
    this.apiService.getPlaylists().subscribe({
      next: (playlists) => {
        this.playlists = playlists.map(playlist => ({
          id: playlist.id,
          nombre: playlist.nombre,
          imagen: playlist.imagen ? playlist.imagen : 'assets/cover/default-playlist.png',
          canciones: playlist.canciones || []
        }));
      },
      error: (error) => {
        console.error('Error cargando listas:', error);
        this.mensaje = 'Error al cargar las listas';
      }
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
          placeholder: 'Nombre de la lista'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: async (data) => {
            if (!data.nombre) {
              this.mensaje = 'El nombre es obligatorio';
              return false;
            }
            try {
              this.apiService.createPlaylist(data.nombre).subscribe({
                next: (playlist) => {
                  this.playlists.push({
                    ...playlist,
                    imagen: 'assets/cover/default-playlist.jpg',
                    canciones: []
                  });
                  this.mensaje = 'Lista creada exitosamente';
                },
                error: (error) => {
                  console.error('Error creando lista:', error);
                  this.mensaje = 'Error al crear la lista';
                }
              });
              return true;
            } catch (error) {
              console.error('Usuario no autenticado:', error);
              this.mensaje = 'Por favor, inicia sesión';
              this.router.navigate(['/login']);
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  selectPlaylist(playlist: Playlist) {
    this.selectedPlaylist = playlist;
    this.showAddSongs = false;
    this.router.navigate(['/lista'], {
      queryParams: {
        id: playlist.id,
        nombre: playlist.nombre,
        canciones: JSON.stringify(playlist.canciones),
        imagen: playlist.imagen
      }
    });
  }

  addSongToPlaylist(song: Song) {
    if (!this.selectedPlaylist || !song.id) {
      console.error('No se ha seleccionado playlist o la canción no tiene ID');
      this.mensaje = 'Error: Selecciona una lista y una canción válida';
      return;
    }
    this.apiService.addSongToPlaylist(this.selectedPlaylist.id, song.id).subscribe({
      next: (playlist) => {
        this.selectedPlaylist!.canciones.push(song);
        this.showAddSongs = false;
        this.mensaje = 'Canción añadida a la lista';
      },
      error: (error) => {
        console.error('Error añadiendo canción:', error);
        this.mensaje = 'Error al añadir la canción';
      }
    });
  }
}
