import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './restablecer-contrasena.component.html',
  styleUrl: './restablecer-contrasena.component.css'
})
export class RestablecerContrasenaComponent {
  
  recoverForm: FormGroup;

  constructor(private fb: FormBuilder,private router: Router) {
    this.recoverForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]]
    });
    
  }

  onSubmit() {
    if (this.recoverForm.valid) {
      // Maneja el envío del formulario
      console.log(this.recoverForm.value);
    } else {
      // Maneja el caso de formulario inválido
      console.log('Formulario inválido');
    }
  }

  irACambioContrasena() {
    this.router.navigate(['/cambio-contrasena']);
  }
}