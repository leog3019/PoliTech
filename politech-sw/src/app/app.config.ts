import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(),
  provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
  provideFirestore(() => getFirestore())]
  // provideFirebaseApp(() => initializeApp(
  // { "projectId": "bankalao-ed14b", "appId": "1:888383840547:web:516e021234315947852c96", "databaseURL": "https://bankalao-ed14b-default-rtdb.firebaseio.com", "storageBucket": "bankalao-ed14b.appspot.com", "apiKey": "AIzaSyCR07ZMbzcqOWwyhoCKIOCBUnsjjOVvrMY", "authDomain": "bankalao-ed14b.firebaseapp.com", "messagingSenderId": "888383840547", "measurementId": "G-NG11S4S6Y0" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideFunctions(() => getFunctions()), provideMessaging(() => getMessaging()), provideStorage(() => getStorage())]
};
