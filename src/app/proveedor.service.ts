
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proveedor {
  idProveedor: number;
  cuit: string;
  razonSocial: string;
  contacto: string | null;
  telefono: string;
  email: string;
  direccion: string | null;
  activo: boolean;
}

export interface ProveedorRequest {
  cuit: string;
  razonSocial: string;
  contacto: string | null;
  telefono: string;
  email: string;
  direccion: string | null;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/proveedores';

  listar(
    soloActivos?: boolean,
    busqueda?: string
  ): Observable<Proveedor[]> {

    let params = new HttpParams();

    if (soloActivos !== undefined) {
      params = params.set('soloActivos', soloActivos);
    }

    if (busqueda?.trim()) {
      params = params.set('busqueda', busqueda.trim());
    }

    return this.http.get<Proveedor[]>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  buscarPorCuit(cuit: string): Observable<Proveedor> {
    return this.http.get<Proveedor>(
      `${this.apiUrl}/cuit/${encodeURIComponent(cuit)}`
    );
  }

  crear(proveedor: ProveedorRequest): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor);
  }

  actualizar(
    id: number,
    proveedor: ProveedorRequest
  ): Observable<Proveedor> {
    return this.http.put<Proveedor>(
      `${this.apiUrl}/${id}`,
      proveedor
    );
  }

  desactivar(id: number): Observable<Proveedor> {
    return this.http.patch<Proveedor>(
      `${this.apiUrl}/${id}/desactivar`,
      {}
    );
  }

  reactivar(id: number): Observable<Proveedor> {
    return this.http.patch<Proveedor>(
      `${this.apiUrl}/${id}/reactivar`,
      {}
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
