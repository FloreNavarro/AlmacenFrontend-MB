
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReporteVentas {
  cantidadVentas: number;
  totalVendido: number;
  promedioVenta: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/reportes';

  obtenerReporteVentas(
    desde: string,
    hasta: string
  ): Observable<ReporteVentas> {

    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);

    return this.http.get<ReporteVentas>(
      `${this.apiUrl}/ventas`,
      { params }
    );
  }
}
