
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    MatCardModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // =====================================
  // SERVICIO DE PRODUCTOS
  // =====================================

  private productoService = inject(ProductoService);

  // =====================================
  // MENÚ LATERAL
  // =====================================

  opcionSeleccionada = 'Inicio';

  esPantallaPequena = window.innerWidth <= 800;

  @HostListener('window:resize')
  alCambiarTamano(): void {
    this.esPantallaPequena = window.innerWidth <= 800;
  }

  seleccionarOpcion(opcion: string): void {
    this.opcionSeleccionada = opcion;
  }

  // =====================================
  // LISTADO DE PRODUCTOS
  // =====================================

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

  // =====================================
  // FORMULARIO DE PRODUCTOS
  // =====================================

  mostrarFormularioProducto = false;

  nuevoProducto: Omit<Producto, 'idProducto'> = {
    nombre: '',
    descripcion: '',
    precioCompra: 0,
    precioVenta: 0,
    stock: 0,
    stockMinimo: 0
  };

  // ABRIR FORMULARIO
  abrirFormularioProducto(): void {
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
      stockMinimo: 0
    };

    this.mostrarFormularioProducto = true;
  }

  // CERRAR FORMULARIO
  cerrarFormularioProducto(): void {
    this.mostrarFormularioProducto = false;
  }

  // GUARDAR PRODUCTO EN MYSQL
  guardarProducto(): void {

    this.productoService.guardarProducto(this.nuevoProducto)
      .subscribe({

        next: (productoGuardado) => {

          console.log('Producto guardado:', productoGuardado);

          alert('Producto registrado correctamente');

          this.cerrarFormularioProducto();

          // Actualizar la tabla
          this.cargarProductos();
        },

        error: (error) => {

          console.error('Error al guardar producto:', error);

          alert('No se pudo registrar el producto');
        }

      });
  }

}

