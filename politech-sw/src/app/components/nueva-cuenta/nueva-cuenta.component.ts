import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nueva-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './nueva-cuenta.component.html',
  styleUrl: './nueva-cuenta.component.css'
})
export class NuevaCuentaComponent {
  openAccountForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.openAccountForm = this.fb.group({
      cedula: ['', Validators.required],
      contactType: ['', Validators.required],
      contactInfo: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.openAccountForm.valid) {
      console.log(this.openAccountForm.value);
      // Aquí puedes agregar la lógica para enviar los datos al servidor
    }
  }
}
