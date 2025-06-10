import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonToast } from '@ionic/angular/standalone';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api-service.service'; // Ajusta la ruta
import { MusicService } from '../services/music.service'; // Ajusta la ruta
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonToast, IonInput, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink]
})
export class LoginPage implements OnInit {
  email: string = '';
  contrasena: string = '';
  mensaje: string = '';
  private apiUrl = 'https://musicmixback.onrender.com/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private musicService: MusicService
  ) {}

  ngOnInit() {
  }

  async iniciarSesion() {
    if (!this.email || !this.contrasena) {
      this.mensaje = 'Por favor, complete email y contraseña';
      return;
    }
    this.mensaje = 'Inicio de sesión exitoso';
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
      //pasa el id a los services que lo usan
      this.apiService.setUserId(userId);
      this.musicService.setUserId(userId);

      this.router.navigate(['/tabs']);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.mensaje = error.error || 'Error al iniciar sesión';
    }
  }
}
