import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private clientesCollection = this.firestore.collection<Cliente>('clientes');

    constructor(private firestore: AngularFirestore) { }

    obtenerClientes(): Observable<Cliente[]> {
        return this.clientesCollection.valueChanges({ idField: 'uid' });
    }

    agregarCliente(cliente: Cliente): Promise<void> {
        const id = this.firestore.createId();
        return this.clientesCollection.doc(id).set({ ...cliente, uid: id });
    }

    actualizarCliente(cliente: Cliente): Promise<void> {
        return this.clientesCollection.doc(cliente.uid).update(cliente);
    }

    eliminarCliente(uid: string): Promise<void> {
        return this.clientesCollection.doc(uid).delete();
    }
}