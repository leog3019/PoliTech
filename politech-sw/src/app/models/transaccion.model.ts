export interface Transaccion {
    id: string;
    cuentaOrigenId: string;
    cuentaDestinoId: string;
    monto: number;
    fecha: Date;
    descripcion?: string;
  }
  