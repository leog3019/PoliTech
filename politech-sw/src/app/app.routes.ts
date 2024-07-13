import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { TransferirFondosComponent } from '@components/transferir-fondos/transferir-fondos.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent },
  { path: 'registro-cliente', component: RegistroClienteComponent},
  { path: 'transferir-fondos', component: TransferirFondosComponent}
];
