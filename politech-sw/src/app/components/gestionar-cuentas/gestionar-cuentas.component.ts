import { Component, OnInit } from '@angular/core';
import { CuentaService } from '../../services/cuenta.service';
import { Cuenta } from '../../models/cuenta.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gestionar-cuentas',
  templateUrl: './gestionar-cuentas.component.html',
  styleUrls: ['./gestionar-cuentas.component.css']
})
export class GestionarCuentasComponent implements OnInit {
  cuentas$: Observable<Cuenta[]> = new Observable<Cuenta[]>(); // Inicializar la propiedad

  constructor(private cuentaService: CuentaService) { }

  ngOnInit() {
    this.cuentas$ = this.cuentaService.obtenerCuentas();
  }

  crearCuenta() {
    const nuevaCuenta: Cuenta = {
      id: '',
      clienteId: 'currentUserUid',  // Debes reemplazar esto con el UID del usuario actual
      saldo: 100,
      creadoEn: new Date()
    };
    this.cuentaService.agregarCuenta(nuevaCuenta).then(() => {
      alert('Cuenta creada exitosamente');
    }).catch(error => {
      console.error('Error al crear la cuenta:', error);
      alert('Hubo un problema al crear la cuenta');
    });
  }
}
