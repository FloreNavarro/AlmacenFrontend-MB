import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fiado {
  idFiado: number;
  cliente: {
    idCliente: number;
    nombre: string;
    apellido: string;
  };
  fecha: string;
  montoTotal: number;
  saldo: number;
  estado: string;
}

export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root'
})
export class FiadoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/fiados';
private clientesUrl = 'http://localhost:8080/api/clientes';

// OBTENER CLIENTES REGISTRADOS
obtenerClientes(): Observable<Cliente[]> {
  return this.http.get<Cliente[]>(this.clientesUrl);
}

registrarCliente(cliente: Omit<Cliente, 'idCliente'>): Observable<Cliente> {
  return this.http.post<Cliente>(this.clientesUrl, cliente);
}

actualizarCliente(
  idCliente: number,
  cliente: Omit<Cliente, 'idCliente'>
): Observable<Cliente> {

  return this.http.put<Cliente>(
    `${this.clientesUrl}/${idCliente}`,
    cliente
  );
}

  // CONSULTAR FIADOS
  obtenerFiados(): Observable<Fiado[]> {
    return this.http.get<Fiado[]>(this.apiUrl);
  }

// REGISTRAR NUEVO FIADO
registrarFiado(
  idCliente: number,
  monto: number
): Observable<Fiado> {

  return this.http.post<Fiado>(this.apiUrl, {
    cliente: { idCliente },
    montoTotal: monto,
    saldo: monto
  });
}

// REGISTRAR PAGO DE UN FIADO
registrarPago(
  idFiado: number,
  importe: number
): Observable<any> {

  return this.http.post(
    `${this.apiUrl}/${idFiado}/pagos`,
    { importe }
  );
}
}