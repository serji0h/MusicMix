import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonButton } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RegisterPage  {

  nombre: string = '';
  email: string = '';
  contrasena: string = '';

  constructor(private http: HttpClient) { }

  registrarUsuario(){
    const usuario = {
      nombre : this.nombre,
      email : this.email,
      contrasena : this.contrasena
    };

    this.http.post('http://localhost:8080/usuarios', usuario)
      .subscribe((response) => {
        console.log('Usuario registrado:', response);
        // Aquí puedes manejar la respuesta del servidor
      }
      , (error) => {
        console.error('Error al registrar el usuario:', error);
        // Aquí puedes manejar el error
      }
      );
  }


}
