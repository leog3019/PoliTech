import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css']
})
export class RegistroClienteComponent {
  cliente: Cliente = {
    uid: '',
    nombre: '',
    nombreUsuario: '',
    correo: '',
    correoVerificado: false
  };
  contrasena: string = '';
  confirmarContrasena: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  async registrarCliente() {
    if (this.contrasena !== this.confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      await this.authService.registrarCliente(this.cliente, this.contrasena);
      this.router.navigate(['/inicio-sesion']);
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      alert('Hubo un problema al registrar el cliente');
    }
  }
}