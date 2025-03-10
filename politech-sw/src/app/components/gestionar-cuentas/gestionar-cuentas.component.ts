import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from "../Shared-components/sidebar/sidebar.component";
@Component({
  selector: 'app-gestionar-cuentas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SidebarComponent],
  templateUrl: './gestionar-cuentas.component.html',
  styleUrl: './gestionar-cuentas.component.css'
})
export class GestionarCuentasComponent {
  constructor(private router: Router) {}

  irANuevaCuenta() {
    this.router.navigate(['/nueva-cuenta']);
  }
}
