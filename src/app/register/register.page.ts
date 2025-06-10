import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonButton, IonToast, IonInput, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonToast, IonButton, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, IonInput, CommonModule, FormsModule]
})
export class RegisterPage {
  nombre: string = '';
  email: string = '';
  contrasena: string = '';
  mensaje: string = '';
  isToastOpen: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  registrarUsuario() {
    const usuario = {
      nombre: this.nombre,
      email: this.email,
      contrasena: this.contrasena
    };

    if (this.nombre.trim() === '' || this.email.trim() === '' || this.contrasena.trim() === '') {
      this.mensaje = 'Rellene todos los campos correctamente';
      this.isToastOpen = true;
      return;
    }

    this.http.post('https://musicmixback.onrender.com/api/auth/register', usuario)
      .subscribe({
        next: (response) => {
          console.log('Usuario registrado:', response);
          this.mensaje = 'Usuario registrado correctamente';
          this.isToastOpen = true;
          // Opcional: Limpiar formulario
          this.nombre = '';
          this.email = '';
          this.contrasena = '';
          this.router.navigate(['/tabs']);

        },
        error: (error) => {
          console.error('Error al registrar el usuario:', error);
          this.mensaje = error.error?.message || 'Error al registrar el usuario';
          this.isToastOpen = true;
        }
      });
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
