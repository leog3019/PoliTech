import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { CambioContrasenaComponent } from './components/cambio-contrasena/cambio-contrasena.component';
import { GestionarCuentasComponent } from './components/gestionar-cuentas/gestionar-cuentas.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { RestablecerContrasenaComponent } from './components/restablecer-contrasena/restablecer-contrasena.component';
import { TransferirFondosComponent } from './components/transferir-fondos/transferir-fondos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio-sesion', pathMatch: 'full' },
  { path: 'inicio-sesion', component: InicioSesionComponent },
  { path: 'cambio-contrasena', component: CambioContrasenaComponent },
  { path: 'gestionar-cuentas', component: GestionarCuentasComponent },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent },
  { path: 'registro-cliente', component: RegistroClienteComponent },
  { path: 'restablecer-contrasena', component: RestablecerContrasenaComponent },
  { path: 'transferir-fondos', component: TransferirFondosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
