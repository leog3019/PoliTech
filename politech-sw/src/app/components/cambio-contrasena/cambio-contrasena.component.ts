import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cambio-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambio-contrasena.component.html',
  styleUrl: './cambio-contrasena.component.css'
})
export class CambioContrasenaComponent {
  recoverForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
}
