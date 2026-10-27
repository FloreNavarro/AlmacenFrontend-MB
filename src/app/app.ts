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

// ABRIR FORMULARIO DE CLIENTES
abrirFormularioCliente(): void {
  this.clienteEnEdicion = null;

  this.nuevoCliente = {
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    direccion: ''
  };

  this.mostrarFormularioCliente = true;
}

editarCliente(cliente: Cliente): void {
  this.clienteEnEdicion = cliente.idCliente;

  this.nuevoCliente = {
    nombre: cliente.nombre,
    apellido: cliente.apellido,
    dni: cliente.dni,
    telefono: cliente.telefono,
    direccion: cliente.direccion
  };

  this.mostrarFormularioCliente = true;
}

// CERRAR FORMULARIO DE CLIENTES

cerrarFormularioCliente(): void {
  this.mostrarFormularioCliente = false;
  this.clienteEnEdicion = null;
}

// GUARDAR NUEVO CLIENTE

guardarCliente(): void {

  if (
    !this.nuevoCliente.nombre.trim() ||
    !this.nuevoCliente.apellido.trim() ||
    !this.nuevoCliente.dni.trim()
  ) {
    alert('Completá nombre, apellido y DNI.');
    return;
  }

  // SI ESTAMOS EDITANDO UN CLIENTE
  if (this.clienteEnEdicion !== null) {

    this.fiadoService.actualizarCliente(
      this.clienteEnEdicion,
      this.nuevoCliente
    ).subscribe({

      next: () => {
        alert('Cliente actualizado correctamente');

        this.cerrarFormularioCliente();
        this.cargarClientes();
      },

      error: (error) => {
        console.error('Error al actualizar cliente:', error);
        alert('No se pudo actualizar el cliente.');
      }

    });

  } else {

    // SI ESTAMOS REGISTRANDO UN CLIENTE NUEVO
    this.fiadoService.registrarCliente(
      this.nuevoCliente
    ).subscribe({

      next: () => {
        alert('Cliente registrado correctamente');

        this.cerrarFormularioCliente();
        this.cargarClientes();
      },

      error: (error) => {
        console.error('Error al registrar cliente:', error);
        alert('No se pudo registrar el cliente.');
      }

    });
  }
}
  // =====================================
  // SERVICIO DE PRODUCTOS
  // =====================================

  private productoService = inject(ProductoService);
private fiadoService = inject(FiadoService);
private cdr = inject(ChangeDetectorRef);
fiados: Fiado[] = [];
get cantidadFiadosPendientes(): number {
  return this.fiados.filter(fiado => fiado.saldo > 0).length;
}
cargandoFiados = false;
errorFiados = '';
clientes: Cliente[] = [];

// FORMULARIO PARA REGISTRAR CLIENTES
mostrarFormularioCliente = false;
clienteEnEdicion: number | null = null;

nuevoCliente = {
  nombre: '',
  apellido: '',
  dni: '',
  telefono: '',
  direccion: ''
};

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

  if (opcion === 'Clientes') {
  this.cargarClientes();
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
  this.cargarClientes();
  this.cargarFiados();
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

