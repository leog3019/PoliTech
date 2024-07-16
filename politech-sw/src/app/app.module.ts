import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { CambioContrasenaComponent } from './components/cambio-contrasena/cambio-contrasena.component';
import { GestionarCuentasComponent } from './components/gestionar-cuentas/gestionar-cuentas.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { RestablecerContrasenaComponent } from './components/restablecer-contrasena/restablecer-contrasena.component';
import { TransferirFondosComponent } from './components/transferir-fondos/transferir-fondos.component';
import { AuthService } from './services/auth.service';
import { ClienteService } from './services/cliente.service';
import { CuentaService } from './services/cuenta.service';
import { TransaccionService } from './services/transaccion.service';

// Importa el AppComponent
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    InicioSesionComponent,
    CambioContrasenaComponent,
    GestionarCuentasComponent,
    RecuperarContrasenaComponent,
    RegistroClienteComponent,
    RestablecerContrasenaComponent,
    TransferirFondosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    AppComponent // Importa el AppComponent en lugar de declararlo
  ],
  providers: [
    AuthService,
    ClienteService,
    CuentaService,
    TransaccionService
  ],
  bootstrap: [AppComponent] // Asegúrate de que AppComponent está en el bootstrap
})
export class AppModule { }
