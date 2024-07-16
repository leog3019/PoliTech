import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Transaccion } from '../models/transaccion.model';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  private transaccionesCollection: AngularFirestoreCollection<Transaccion>;

  constructor(private firestore: AngularFirestore) {
    this.transaccionesCollection = this.firestore.collection<Transaccion>('transacciones');
  }

  obtenerTransacciones(): Observable<Transaccion[]> {
    return this.transaccionesCollection.valueChanges({ idField: 'id' });
  }

  agregarTransaccion(transaccion: Transaccion): Promise<void> {
    const id = this.firestore.createId();
    transaccion.id = id;
    return this.transaccionesCollection.doc(id).set(transaccion);
  }

  actualizarTransaccion(transaccionId: string, transaccion: Transaccion): Promise<void> {
    return this.transaccionesCollection.doc(transaccionId).update(transaccion);
  }

  eliminarTransaccion(transaccionId: string): Promise<void> {
    return this.transaccionesCollection.doc(transaccionId).delete();
  }
}
