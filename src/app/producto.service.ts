
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/productos';

  // CONSULTAR PRODUCTOS
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // AGREGAR PRODUCTO
  guardarProducto(
    producto: Omit<Producto, 'idProducto'>
  ): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  // MODIFICAR PRODUCTO
  modificarProducto(
    id: number,
    producto: Producto
  ): Observable<Producto> {
    return this.http.put<Producto>(
      `${this.apiUrl}/${id}`,
      producto
    );
  }

  // ELIMINAR PRODUCTO
  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
