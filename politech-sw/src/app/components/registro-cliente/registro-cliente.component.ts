import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css']
})
export class RegistroClienteComponent {
  constructor(private router: Router) {}

  cancelar() {
    this.router.navigate(['/login']);
  }
}
