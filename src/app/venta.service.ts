import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Producto incluido en una venta
export interface DetalleVentaRequest {
    idProducto: number;
    cantidad: number;
}

// Datos enviados al backend
export interface VentaRequest {
    venta: {
        cliente?: {
            idCliente: number;
        } | null;
        porcentajeDescuento?: number;
    };
    detalles: DetalleVentaRequest[];
}

// Datos que devuelve el backend
export interface Venta {
    idVenta: number;
    fecha: string;
    subtotal: number;
    porcentajeDescuento: number;
    montoDescuento: number;
    total: number;
    cliente: {
        idCliente: number;
        nombre: string;
        apellido: string;
    } | null;
}

export interface DetalleVentaResponse {
    idDetalle: number;
    idProducto: number;
    nombreProducto: string;
    cantidad: number;
    precio: number;
    subtotal: number;
}

@Injectable({
    providedIn: 'root'
})
export class VentaService {

    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:8080/api/ventas';

    // CONSULTAR TODAS LAS VENTAS
    obtenerVentas(): Observable<Venta[]> {
        return this.http.get<Venta[]>(this.apiUrl);
    }

    // CONSULTAR UNA VENTA POR ID
    obtenerVentaPorId(id: number): Observable<Venta> {
        return this.http.get<Venta>(`${this.apiUrl}/${id}`);
    }

    // CONSULTAR LOS DETALLES DE UNA VENTA
    obtenerDetalles(id: number): Observable<DetalleVentaResponse[]> {
        return this.http.get<DetalleVentaResponse[]>(
            `${this.apiUrl}/${id}/detalles`
        );
    }

    // REGISTRAR UNA VENTA NUEVA
    registrarVenta(venta: VentaRequest): Observable<Venta> {
        return this.http.post<Venta>(this.apiUrl, venta);
    }
}