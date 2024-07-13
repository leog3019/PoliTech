import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RegistroClienteComponent } from '@components/registro-cliente/registro-cliente.component';
import { TransferirFondosComponent } from '@components/transferir-fondos/transferir-fondos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, RecuperarContrasenaComponent, RegistroClienteComponent, TransferirFondosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'politech-sw';
}
