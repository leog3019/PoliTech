import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from '@components/login/login.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { TransferirFondosComponent } from '@components/transferir-fondos/transferir-fondos.component';
import { RestablecerContrasenaComponent } from './components/restablecer-contrasena/restablecer-contrasena.component';
import { CambioContrasenaComponent } from '@components/cambio-contrasena/cambio-contrasena.component';
import { GestionarCuentasComponent } from '@components/gestionar-cuentas/gestionar-cuentas.component';
import { NuevaCuentaComponent } from '@components/nueva-cuenta/nueva-cuenta.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent },
  { path: 'registro-cliente', component: RegistroClienteComponent},
  { path: 'transferir-fondos', component: TransferirFondosComponent},
  { path: 'restablecer-contrasena', component: RestablecerContrasenaComponent},
  { path: 'cambio-contrasena', component: CambioContrasenaComponent },
  { path: 'mis-productos', component: GestionarCuentasComponent },
  { path: 'nueva-cuenta', component: NuevaCuentaComponent},
  { path: 'gestionar-cuentas', component: GestionarCuentasComponent}
];



