import { Component, OnInit } from '@angular/core';
import { CuentaService } from '../../services/cuenta.service';
import { TransaccionService } from '../../services/transaccion.service';
import { Cuenta } from '../../models/cuenta.model';
import { Transaccion } from '../../models/transaccion.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transferir-fondos',
  templateUrl: './transferir-fondos.component.html',
  styleUrls: ['./transferir-fondos.component.css']
})
export class TransferirFondosComponent implements OnInit {
  cuentas$: Observable<Cuenta[]> = new Observable<Cuenta[]>(); // Inicializar la propiedad
  cuentaOrigen: string = ''; // Inicializar la propiedad
  cuentaDestino: string = ''; // Inicializar la propiedad
  monto: number = 0; // Inicializar la propiedad

  constructor(private cuentaService: CuentaService, private transaccionService: TransaccionService) { }

  ngOnInit() {
    this.cuentas$ = this.cuentaService.obtenerCuentas();
  }

  async transferirFondos() {
    if (this.cuentaOrigen === this.cuentaDestino) {
      alert('La cuenta origen y la cuenta destino no pueden ser la misma');
      return;
    }

    const transaccion: Transaccion = {
      id: '',
      cuentaOrigenId: this.cuentaOrigen,
      cuentaDestinoId: this.cuentaDestino,
      monto: this.monto,
      fecha: new Date(),
      descripcion: 'Transferencia de fondos'
    };

    try {
      await this.transaccionService.agregarTransaccion(transaccion);
      alert('Transferencia realizada exitosamente');
    } catch (error) {
      console.error('Error al realizar la transferencia:', error);
      alert('Hubo un problema al realizar la transferencia');
    }
  }
}
