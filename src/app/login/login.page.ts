import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonToast } from '@ionic/angular/standalone';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api-service.service'; // Ajusta la ruta
import { MusicService } from '../services/music.service'; // Ajusta la ruta

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonToast, IonInput, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  email: string = '';
  contrasena: string = '';
  mensaje: string = '';
  private apiUrl = 'https://localhost:8443/api/auth'; // Backend URL

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private musicService: MusicService
  ) {}

  ngOnInit() {
    // No comprobamos sesiones previas porque no almacenamos userId
  }

  async iniciarSesion() {
    if (!this.email || !this.contrasena) {
      this.mensaje = 'Por favor, complete email y contraseña';
      return;
    }

    const credentials = {
      email: this.email.trim(),
      contrasena: this.contrasena.trim()
    };

    try {
      const response = await this.http.post<any>(`${this.apiUrl}/login`, credentials, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }).toPromise();

      const userId = response.userId;
      this.apiService.setUserId(userId); // Pasa el userId a ApiService
      this.musicService.setUserId(userId); // Pasa el userId a MusicService
      this.mensaje = 'Inicio de sesión exitoso';
      this.router.navigate(['/tabs']);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.mensaje = error.error || 'Error al iniciar sesión';
    }
  }
}
