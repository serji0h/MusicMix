import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const CLIENT_ID = 'f6719599957446eba0db490a9728d99f';
const REDIRECT_URI = Capacitor.isNativePlatform()
  ? 'myapp://callback'
  : 'https://localhost:8443/callback';
const SCOPES = 'user-read-email user-read-private';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class Tab2Page {
  accessToken: string | null = null;

  constructor() {
    this.checkForAuthCode();
  }

  async loginWithSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

    await Browser.open({ url: authUrl });
  }

  async checkForAuthCode() {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', ''));
      this.accessToken = params.get('access_token');
      console.log('Access token:', this.accessToken);

      // Cierra la pestaña si es necesario
      await Browser.close();
    }
  }
}
