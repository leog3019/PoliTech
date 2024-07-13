import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { TransferirFondosComponent } from '@components/transferir-fondos/transferir-fondos.component';
import { RestablecerContrasenaComponent } from './components/restablecer-contrasena/restablecer-contrasena.component';
import { CambioContrasenaComponent } from '@components/cambio-contrasena/cambio-contrasena.component';
import { GestionarCuentasComponent } from '@components/gestionar-cuentas/gestionar-cuentas.component';
import { NuevaCuentaComponent } from '@components/nueva-cuenta/nueva-cuenta.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent },
  { path: 'registro-cliente', component: RegistroClienteComponent},
  { path: 'transferir-fondos', component: TransferirFondosComponent},
  { path: 'restablecer-contrasena', component: RestablecerContrasenaComponent},
  { path: 'cambio-contrasena', component: CambioContrasenaComponent },
  { path: 'mis-productos', component: GestionarCuentasComponent },
  { path: 'solicitar-cuenta', component: NuevaCuentaComponent}
];



