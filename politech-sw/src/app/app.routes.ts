import { Routes } from '@angular/router';
import { RestablecerContrasenaComponent } from './components/restablecer-contrasena/restablecer-contrasena.component';
import { CambioContrasenaComponent } from '@components/cambio-contrasena/cambio-contrasena.component';
import { GestionarCuentasComponent } from '@components/gestionar-cuentas/gestionar-cuentas.component';
import { NuevaCuentaComponent } from '@components/nueva-cuenta/nueva-cuenta.component';

export const routes: Routes = [
    { path: 'restablecer-contrasena', component: RestablecerContrasenaComponent},
    { path: 'cambio-contrasena', component: CambioContrasenaComponent },
    { path: 'mis-productos', component: GestionarCuentasComponent },
    { path: 'solicitar-cuenta', component: NuevaCuentaComponent}
];