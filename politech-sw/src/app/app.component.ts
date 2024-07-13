import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RegistroClienteComponent } from '@components/registro-cliente/registro-cliente.component';
import { TransferirFondosComponent } from '@components/transferir-fondos/transferir-fondos.component';
import { RestablecerContrasenaComponent } from "./components/restablecer-contrasena/restablecer-contrasena.component";
import { CambioContrasenaComponent } from "./components/cambio-contrasena/cambio-contrasena.component";
import { GestionarCuentasComponent } from '@components/gestionar-cuentas/gestionar-cuentas.component';
import { NuevaCuentaComponent } from "./components/nueva-cuenta/nueva-cuenta.component";
import { LoginComponent } from '@components/login/login.component';
import { HeaderComponent } from '@components/Shared-components/header/header.component';
import { FooterComponent } from '@components/Shared-components/footer/footer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RestablecerContrasenaComponent,
    CambioContrasenaComponent,
    GestionarCuentasComponent,
    NuevaCuentaComponent,
    LoginComponent, 
    HeaderComponent, 
    FooterComponent,
    HomeComponent, 
    RecuperarContrasenaComponent, 
    RegistroClienteComponent, 
    TransferirFondosComponent
    
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'politech-sw';
}
