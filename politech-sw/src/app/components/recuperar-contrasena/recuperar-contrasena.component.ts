import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent {
  correo: string = '';

  constructor(private authService: AuthService) { }

  async recuperarContrasena() {
    try {
      await this.authService.recuperarContrasena(this.correo);
      alert('Correo de recuperación enviado. Por favor, revisa tu bandeja de entrada.');
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      alert('Hubo un problema al enviar el correo de recuperación.');
    }
  }
}
