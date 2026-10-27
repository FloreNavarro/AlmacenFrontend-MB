import { Component, HostListener, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Producto, ProductoService } from './producto.service';
import { Fiado, FiadoService, Cliente } from './fiado.service';
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
cargarClientes(): void {
  this.fiadoService.obtenerClientes().subscribe({
    next: (datos) => {
      this.clientes = datos;
      this.cdr.detectChanges();
    },

    error: (error) => {
      console.error('Error al cargar clientes:', error);
    }
  });
}
  // =====================================
  // SERVICIO DE PRODUCTOS
  // =====================================

  private productoService = inject(ProductoService);
private fiadoService = inject(FiadoService);
private cdr = inject(ChangeDetectorRef);
fiados: Fiado[] = [];
cargandoFiados = false;
errorFiados = '';
clientes: Cliente[] = [];
// =====================================
// FORMULARIO DE FIADOS
// =====================================

mostrarFormularioFiado = false;

nuevoFiado = {
  idCliente: 0,
  monto: 0
};

abrirFormularioFiado(): void {
  this.nuevoFiado = {
    idCliente: 0,
    monto: 0
  };

  this.mostrarFormularioFiado = true;

  // Consultar los clientes registrados en MySQL
  this.cargarClientes();
}
cerrarFormularioFiado(): void {
  this.mostrarFormularioFiado = false;
}
guardarFiado(): void {

  if (this.nuevoFiado.idCliente <= 0 ||
      this.nuevoFiado.monto <= 0) {
    alert('Ingresá un cliente válido y un monto mayor a cero.');
    return;
  }

  this.fiadoService.registrarFiado(
    this.nuevoFiado.idCliente,
    this.nuevoFiado.monto
  ).subscribe({

    next: () => {
      alert('Fiado registrado correctamente');

      this.cerrarFormularioFiado();
      this.cargarFiados();
    },

    error: (error) => {
      console.error('Error al registrar fiado:', error);
      alert('No se pudo registrar el fiado');
    }

  });
}

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

  if (opcion === 'Fiados') {
    this.cargarFiados();
  }
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
// FORMULARIO PARA REGISTRAR PAGOS
// =====================================

mostrarFormularioPago = false;

fiadoSeleccionado: Fiado | null = null;

importePago = 0;

abrirFormularioPago(fiado: Fiado): void {
  this.fiadoSeleccionado = fiado;
  this.importePago = 0;
  this.mostrarFormularioPago = true;
}

cerrarFormularioPago(): void {
  this.mostrarFormularioPago = false;
  this.fiadoSeleccionado = null;
  this.importePago = 0;
}

confirmarPago(): void {

  if (!this.fiadoSeleccionado) {
    return;
  }

  if (
    this.importePago <= 0 ||
    this.importePago > this.fiadoSeleccionado.saldo
  ) {
    alert('El importe debe ser mayor a cero y no superar el saldo pendiente.');
    return;
  }

  const idFiado = this.fiadoSeleccionado.idFiado;

  this.fiadoService.registrarPago(
    idFiado,
    this.importePago
  ).subscribe({

    next: () => {
      alert('Pago registrado correctamente');

      this.cerrarFormularioPago();
      this.cargarFiados();
    },

    error: (error) => {
      console.error('Error al registrar el pago:', error);
      alert('No se pudo registrar el pago');
    }

  });
}

  // =====================================
// LISTADO DE FIADOS
// =====================================

cargarFiados(): void {
  this.cargandoFiados = true;
  this.errorFiados = '';

  this.fiadoService.obtenerFiados().subscribe({
    next: (datos) => {
      this.fiados = datos;
      this.cargandoFiados = false;

      this.cdr.detectChanges();

      console.log('Fiados recibidos:', datos);
    },

    error: (error) => {
      console.error('Error al obtener fiados:', error);

      this.errorFiados = 'No se pudieron cargar los fiados.';
      this.cargandoFiados = false;

      this.cdr.detectChanges();
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

