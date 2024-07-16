import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private firestore: AngularFirestore) { }

  // Método para agregar un nuevo cliente
  agregarCliente(cliente: Cliente) {
    return this.firestore.collection('clientes').add(cliente);
  }

  // Método para obtener todos los clientes
  obtenerClientes() {
    return this.firestore.collection('clientes').snapshotChanges();
  }

  // Método para actualizar un cliente
  actualizarCliente(clienteId: string, data: Partial<Cliente>) {
    return this.firestore.collection('clientes').doc(clienteId).update(data);
  }

  // Método para eliminar un cliente
  eliminarCliente(clienteId: string) {
    return this.firestore.collection('clientes').doc(clienteId).delete();
  }
}
