import { Component } from '@angular/core';
import { CuentasClienteComponent } from "../../cuentas-cliente/cuentas-cliente.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CuentasClienteComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
