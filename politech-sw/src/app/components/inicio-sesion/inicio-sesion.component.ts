import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {
  // Propiedades para el registro
  nombreRegistro: string = '';
  nombreUsuarioRegistro: string = '';
  correoRegistro: string = '';
  contrasenaRegistro: string = '';

  // Propiedades para el inicio de sesión
  correo: string = '';
  contrasena: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  async iniciarSesion() {
    try {
      await this.authService.iniciarSesion(this.correo, this.contrasena);
      this.router.navigate(['/dashboard']); // Redirige a la página principal
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un problema al iniciar sesión');
    }
  }

  async registrar() {
    try {
      const cliente = { nombre: this.nombreRegistro, nombreUsuario: this.nombreUsuarioRegistro, correo: this.correoRegistro };
      await this.authService.registrarCliente(cliente, this.contrasenaRegistro);
      alert('Registro exitoso. Por favor, inicia sesión.');
      this.togglePanel('login');
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Hubo un problema al registrar');
    }
  }

  togglePanel(panel: string) {
    const container = document.getElementById('container');
    if (panel === 'login') {
      container?.classList.remove('right-panel-active');
    } else if (panel === 'register') {
      container?.classList.add('right-panel-active');
    }
  }
}
