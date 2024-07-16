import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  async registrarCliente(cliente: Cliente, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(cliente.correo, password);
      cliente.uid = result.user?.uid || '';
      cliente.correoVerificado = result.user?.emailVerified || false;
      await this.firestore.collection('clientes').doc(cliente.uid).set(cliente);
      return result;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  async iniciarSesion(correo: string, password: string) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(correo, password);
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error;
    }
  }

  async cerrarSesion() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/inicio-sesion']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  obtenerUsuarioActual() {
    return this.afAuth.authState;
  }

  async recuperarContrasena(correo: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(correo);
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      throw error;
    }
  }

  async restablecerContrasena(actionCode: string, nuevaContrasena: string) {
    try {
      await this.afAuth.confirmPasswordReset(actionCode, nuevaContrasena);
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      throw error;
    }
  }

  async cambiarContrasena(contrasenaActual: string, nuevaContrasena: string) {
    try {
      const user = await this.afAuth.currentUser;
      if (user && user.email) {
        await this.afAuth.signInWithEmailAndPassword(user.email, contrasenaActual);
        await user.updatePassword(nuevaContrasena);
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      throw error;
    }
  }
}
