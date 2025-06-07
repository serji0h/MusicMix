import { MusicService } from './../services/music.service';
import { navigate } from 'ionicons/icons';
import { ApiService,Song, Playlist } from './../services/api-service.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonList, IonLabel, IonItem } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink]
})
export class ListPage implements OnInit {
  id : number = 0;
  nombre : string = "";

  songs: Song[] = [];
  constructor(private route : ActivatedRoute, private navegateRouter: Router, private apiService : ApiService, private musicService : MusicService) { }

     ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.id = params['id'];
        this.nombre = params['nombre'];
        console.log(this.musicService.songsWeb)
        // Array para almacenar los IDs de las canciones
        let songIds: number[] = [];

        // Obtener los IDs de las canciones de la lista de reproducción
        this.apiService.getSongsFromPlaylist(this.id).subscribe({
          next: (songsFromPlaylist) => {
            // Extraer los IDs de las canciones
            songIds = songsFromPlaylist.map(song => song.id!);

            // Filtrar las canciones de songsSearched que coincidan con los IDs
            this.songs = this.musicService.songsWeb.filter(song => songIds.includes(song.id!));
          },
          error: (error) => console.error('Error cargando canciones de la lista:', error),
        });
      });
    }
  showAddSongs(){
    console.log(this.songs);
    this.navegateRouter.navigate(['/tabs/tab1']);
  }


  openPlayer(song: Song) {
    this.navegateRouter.navigate(['/music-player'], {
      queryParams: {
        nombre: song.nombre,
        path: song.path,
        duration: song.duration || 0,
      },
    });
  }

}
