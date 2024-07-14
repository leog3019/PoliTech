import { Component } from '@angular/core';
import { HeaderComponent } from "../Shared-components/header/header.component";
import { SidebarComponent } from "../Shared-components/sidebar/sidebar.component";

@Component({
  selector: 'app-cuentas-cliente',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent],
  templateUrl: './cuentas-cliente.component.html',
  styleUrl: './cuentas-cliente.component.css'
})
export class CuentasClienteComponent {

}
