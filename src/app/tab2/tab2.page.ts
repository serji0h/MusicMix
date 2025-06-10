import { Component, OnInit } from '@angular/core';
import { IonHeader, IonButton, IonContent, IonToolbar, IonTitle } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [IonTitle, IonToolbar, IonHeader, IonButton, IonContent]
})

export class Tab2Page implements OnInit {
  clientId = 'f6719599957446eba0db490a9728d99f';
  redirectUri = 'http://127.0.0.1:8100/tabs/tab2';
  //los permismos que se le van a solicitar al usuario
  scope = 'user-read-email streaming user-read-private user-modify-playback-state user-read-playback-state';

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkForAuthorizationCode();
  }

  async loginWithSpotify() {
    const codeVerifier = this.generateRandomString(64);
    localStorage.setItem('code_verifier', codeVerifier);

    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: this.redirectUri
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async checkForAuthorizationCode() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    console.log('Código de autorización recibido:', code);
    if (code) {
      const token = await this.getToken(code);
      if (token.access_token) {
        localStorage.setItem('access_token', token.access_token);
        console.log('Token recibido:', token);
        this.router.navigate(['/spotify']);
      } else {
        console.error('Error al recibir token:', token);
      }

      //limpia la url
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }

  async getToken(code: string) {
    const codeVerifier = localStorage.getItem('code_verifier');

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
       body: new URLSearchParams({
      client_id: this.clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      code_verifier: codeVerifier || '',
    }),
  }

  const body = await fetch(url, payload);
  const response = await body.json();
    return response;
  }

  generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values).map(x => possible.charAt(x % possible.length)).join('');
  }

  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
