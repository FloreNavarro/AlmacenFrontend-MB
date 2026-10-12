
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Producto, ProductoService } from './producto.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private productoService = inject(ProductoService);

  opcionSeleccionada = 'Inicio';

  esPantallaPequena = window.innerWidth <= 800;

  productos: Producto[] = [];

  cargandoProductos = false;
  errorProductos = '';

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargandoProductos = true;
    this.errorProductos = '';

    this.productoService.obtenerProductos().subscribe({
      next: (datos) => {
        this.productos = datos;
        this.cargandoProductos = false;
        console.log('Productos recibidos:', datos);
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
        this.errorProductos = 'No se pudieron cargar los productos.';
        this.cargandoProductos = false;
      }
    });
  }

  @HostListener('window:resize')
  alCambiarTamano(): void {
    this.esPantallaPequena = window.innerWidth <= 800;
  }

  seleccionarOpcion(opcion: string): void {
    this.opcionSeleccionada = opcion;
  }

}
