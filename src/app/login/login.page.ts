import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonToast } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonToast, IonInput, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class LoginPage implements OnInit {
  email: string = '' ;
  contrasena: string = '';
  mensaje: "Error al iniciar sesión" | "Usuario no encontrado" | "Se ha Iniciado Sesión" = "Error al iniciar sesión";
  constructor(private http:HttpClient, private router:Router) { }

  ngOnInit() {
    // para saber si luego puede implementar algo para hacer que compruebe si ya se habia logeado
  }

  iniciarSesion() {
    console.log('Iniciando sesión con:', this.email, this.contrasena);

    this.http.get<any[]>("http://localhost:8080/usuarios").subscribe({
      next: (usuarios) => {
        const usuario = usuarios.find(
          u => u.email.trim() === this.email.trim() && u.contrasena.trim() === this.contrasena.trim()
        );

        if (usuario) {
          console.log('Usuario encontrado:', usuario);
          this.mensaje = "Se ha Iniciado Sesión";

          this.router.navigate(['/tabs']);
        } else {
          console.error('Usuario no encontrado');
          this.mensaje = "Usuario no encontrado";
        }
      },
      error: (error) => {
        this.mensaje = "Error al iniciar sesión";
        console.error("Error al obtener al usuario", error);
      }
    });
  }

}
