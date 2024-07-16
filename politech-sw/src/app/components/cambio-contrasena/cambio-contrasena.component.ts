import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cambio-contrasena',
  templateUrl: './cambio-contrasena.component.html',
  styleUrls: ['./cambio-contrasena.component.css']
})
export class CambioContrasenaComponent {
  contrasenaActual: string = '';
  nuevaContrasena: string = '';
  confirmarNuevaContrasena: string = '';

  constructor(private authService: AuthService) { }

  async cambiarContrasena() {
    if (this.nuevaContrasena !== this.confirmarNuevaContrasena) {
      alert('Las nuevas contraseñas no coinciden');
      return;
    }
    try {
      await this.authService.cambiarContrasena(this.contrasenaActual, this.nuevaContrasena);
      alert('Contraseña cambiada exitosamente');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      alert('Hubo un problema al cambiar la contraseña');
    }
  }
}
