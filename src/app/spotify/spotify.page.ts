import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, SearchbarInputEventDetail, IonButton, IonIcon, IonInput, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.page.html',
  styleUrls: ['./spotify.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonList, IonIcon, IonButton,IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SpotifyPage implements OnInit {
  currentPreviewUrl: string | null = null;
  audio = new Audio();
  query : string = '';
  tracks : any[] = [];

  async searchTracks() {
    if (!this.query || this.query.trim() === '') {
      console.error('El campo de búsqueda está vacío');
      return;
    }

    const token = localStorage.getItem('access_token');
    console.log('Token de acceso:', token);
    if (!token) {
      console.error('Token no disponible');
      return;
    }

    const params = new URLSearchParams({
      q: this.query.trim(),
      type: 'track',
      limit: '20'
    });

    try {
      const res = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      this.tracks = data.tracks.items;
      console.log('🎵 Canciones encontradas:', data.tracks.items);
    } catch (error) {
      console.error('Error al buscar canciones:', error);
    }
  }

  playPreview(track: any) {
    console.log('Reproduciendo vista previa de la canción:', track.name);
    console.log('URL de vista previa:', track.preview_url);
    if (this.currentPreviewUrl === track.preview_url) {
      this.audio.pause();
      this.currentPreviewUrl = null;
      return;
    }

    if (track.preview_url) {
      this.audio.src = track.preview_url;
      this.audio.play();
      this.currentPreviewUrl = track.preview_url;
    } else {
      alert('Esta canción no tiene vista previa 😢');
    }
  }

  constructor() {
    addIcons({
      searchOutline})
   }

  ngOnInit() {
  }

}
