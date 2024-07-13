import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RestablecerContrasenaComponent } from "./components/restablecer-contrasena/restablecer-contrasena.component";
import { CambioContrasenaComponent } from "./components/cambio-contrasena/cambio-contrasena.component";
import { GestionarCuentasComponent } from '@components/gestionar-cuentas/gestionar-cuentas.component';
import { NuevaCuentaComponent } from "./components/nueva-cuenta/nueva-cuenta.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RestablecerContrasenaComponent,
    CambioContrasenaComponent,
    GestionarCuentasComponent,
    NuevaCuentaComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'politech-sw';
}
