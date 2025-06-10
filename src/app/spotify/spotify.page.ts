import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, SearchbarInputEventDetail, IonButton, IonIcon, IonInput, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.page.html',
  styleUrls: ['./spotify.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonIcon,IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SpotifyPage implements OnInit {
  currentPreviewUrl: string | null = null;
  audio = new Audio();
  query : string = '';
  tracks : any[] = [];


  player: any;
  deviceId: string = '';
  token: string = '';




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

  async playTrack(track: any) {
    if (!track.uri || !this.deviceId) {
      alert('No se puede reproducir esta canción');
      return;
    }

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [track.uri]
        })
      });

      console.log(`Reproduciendo ${track.name}`);
    } catch (error) {
      console.error('Error al reproducir la canción:', error);
    }
  }

  constructor() {
    (window as any).onSpotifyWebPlaybackSDKReady = this.initializeSpotifyPlayer.bind(this);
    addIcons({searchOutline})
   }

   ngOnInit() {
    this.token = localStorage.getItem('access_token') || '';
    this.loadSpotifySDK();
  }

  loadSpotifySDK() {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.onload = () => this.initializeSpotifyPlayer();
    document.body.appendChild(script);
  }


  initializeSpotifyPlayer() {
    this.player = new (window as any).Spotify.Player({
      name: 'Reproductor Ionic',
      getOAuthToken: (cb: (arg0: string) => any) => cb(this.token),
      volume: 0.8
    });

    this.player.addListener('ready', ({ device_id }: any) => {
      console.log('✅ Reproductor listo con ID:', device_id);
      this.deviceId = device_id;
      this.transferPlaybackHere();
    });

    this.player.addListener('initialization_error', ({ message }: any) => console.error('Error de inicialización', message));
    this.player.addListener('authentication_error', ({ message }: any) => console.error('Error de autenticación', message));
    this.player.addListener('account_error', ({ message }: any) => console.error('Error de cuenta', message));
    this.player.addListener('playback_error', ({ message }: any) => console.error('Error de reproducción', message));

    this.player.connect();
  }

  transferPlaybackHere() {
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        device_ids: [this.deviceId],
        play: false
      })
    });
  }


}
