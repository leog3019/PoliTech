import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Cuenta } from '../models/cuenta.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  constructor(private firestore: AngularFirestore) { }

  obtenerCuentas(): Observable<Cuenta[]> {
    return this.firestore.collection<Cuenta>('cuentas').valueChanges();
  }

  agregarCuenta(cuenta: Cuenta) {
    const id = this.firestore.createId();
    cuenta.id = id;
    return this.firestore.collection('cuentas').doc(id).set(cuenta);
  }

  actualizarCuenta(cuenta: Cuenta) {
    return this.firestore.collection('cuentas').doc(cuenta.id).update(cuenta);
  }
}
