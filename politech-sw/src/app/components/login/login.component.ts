import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) {}

  irARegistro() {
    this.router.navigate(['/registro-cliente']);
  }

  irARecuperarContrasena() {
    this.router.navigate(['/recuperar-contrasena']);
  }

  irAGestionarCuentas() {
    this.router.navigate(['/gestionar-cuentas']);
  }
}
