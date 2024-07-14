import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { ClienteService } from './services/cliente.service';
import { TransaccionService } from './services/transaccion.service';

@NgModule({
        imports: [
            BrowserModule,
            AngularFireModule.initializeApp(environment.firebaseConfig),
            AngularFirestoreModule,
            AngularFireAuthModule
        ],
        declarations: [\
            // Remove AppComponent declaration
        ],
        providers: [
            ClienteService,
            ClienteService,
            TransaccionService
        ],
    })
    
export class AppModule { }