
import {
  Component,
  HostListener,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Producto, ProductoService } from './producto.service';
import { Fiado, FiadoService, Cliente } from './fiado.service';
import { Venta, VentaRequest, VentaService, DetalleVentaResponse } from './venta.service';

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
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // =====================================
  // SERVICIOS
  // =====================================

  private productoService = inject(ProductoService);
  private fiadoService = inject(FiadoService);
  private cdr = inject(ChangeDetectorRef);
  private ventaService = inject(VentaService);
  ventas: Venta[] = [];
  ventaSeleccionada: Venta | null = null;
  detallesVentaSeleccionada: DetalleVentaResponse[] = [];
  mostrarFormularioVenta = false;
  idClienteVenta: number | null = null;
  idProductoVenta: number | null = null;
  cantidadVenta: number = 1;
  porcentajeDescuentoVenta: number = 0;
  detallesNuevaVenta: {
    idProducto: number;
    nombreProducto: string;
    cantidad: number;
    precio: number;
    subtotal: number;
  }[] = [];
  // =====================================
  // CARGAR VENTAS DESDE EL BACKEND
  // =====================================

  cargarVentas(): void {
    this.ventaService.obtenerVentas().subscribe({
      next: (datos) => {
        this.ventas = datos;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error al cargar ventas:', error);
      }
    });
  }

  // CONSULTAR LOS DETALLES DE UNA VENTA
  verDetalleVenta(venta: Venta): void {
    this.ventaSeleccionada = venta;
    this.detallesVentaSeleccionada = [];

    this.ventaService.obtenerDetalles(venta.idVenta).subscribe({
      next: (datos) => {
        this.detallesVentaSeleccionada = datos;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar los detalles de la venta:', error);
        alert('No se pudieron cargar los detalles de la venta.');
      }
    });
  }

  // ABRIR FORMULARIO DE VENTA
  abrirFormularioVenta(): void {
    this.mostrarFormularioVenta = true;
  }

  // CERRAR FORMULARIO DE VENTA
  cerrarFormularioVenta(): void {
    this.mostrarFormularioVenta = false;
  }
  agregarProductoVenta(): void {
    if (this.idProductoVenta === null) {
      alert('Seleccioná un producto.');
      return;
    }

    if (!Number.isFinite(this.cantidadVenta) || this.cantidadVenta <= 0) {
      alert('La cantidad debe ser mayor que cero.');
      return;
    }

    const producto = this.productos.find(
      p => p.idProducto === this.idProductoVenta
    );

    if (!producto) {
      alert('No se encontró el producto.');
      return;
    }

    const cantidad = Number(this.cantidadVenta);
    const precio = Number(producto.precioVenta);

    this.detallesNuevaVenta.push({
      idProducto: producto.idProducto,
      nombreProducto: producto.nombre,
      cantidad: cantidad,
      precio: precio,
      subtotal: cantidad * precio
    });

    this.idProductoVenta = null;
    this.cantidadVenta = 1;
  }
  calcularTotalVenta(): number {
    const subtotal = this.detallesNuevaVenta.reduce(
      (total, detalle) => total + detalle.subtotal,
      0
    );

    const descuento = Number(this.porcentajeDescuentoVenta) || 0;

    const porcentaje = Math.min(100, Math.max(0, descuento));

    return subtotal - (subtotal * porcentaje / 100);
  }

  // ELIMINAR UN PRODUCTO DE LA VENTA
  eliminarProductoVenta(indice: number): void {
    this.detallesNuevaVenta.splice(indice, 1);
  }

  registrarVenta(): void {
    if (this.detallesNuevaVenta.length === 0) {
      alert('Tenés que agregar al menos un producto.');
      return;
    }

    const request: VentaRequest = {
      venta: {
        cliente: this.idClienteVenta !== null
          ? { idCliente: this.idClienteVenta }
          : null,
        porcentajeDescuento: this.porcentajeDescuentoVenta
      },
      detalles: this.detallesNuevaVenta.map(detalle => ({
        idProducto: detalle.idProducto,
        cantidad: detalle.cantidad
      }))
    };

    this.ventaService.registrarVenta(request).subscribe({
      next: () => {
        alert('Venta registrada correctamente.');

        this.detallesNuevaVenta = [];
        this.idClienteVenta = null;
        this.idProductoVenta = null;
        this.cantidadVenta = 1;
        this.porcentajeDescuentoVenta = 0;

        this.cerrarFormularioVenta();
        this.cargarVentas();
        this.cargarProductos();
      },
      error: (error) => {
        console.error('Error al registrar la venta:', error);
        alert('No se pudo registrar la venta.');
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

    if (opcion === 'Productos') {
      this.cargarProductos();
    }

    if (opcion === 'Clientes') {
      this.cargarClientes();
    }

    if (opcion === 'Fiados') {
      this.cargarFiados();
    }
    if (opcion === 'Ventas') {
      this.cargarVentas();
    }
  }

  // =====================================
  // INICIALIZACIÓN
  // =====================================

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarClientes();
    this.cargarFiados();
    this.cargarVentas();
  }

  // =====================================
  // PRODUCTOS
  // =====================================

  productos: Producto[] = [];

  cargandoProductos = false;
  errorProductos = '';

  mostrarFormularioProducto = false;
  productoEnEdicion: number | null = null;

  nuevoProducto: Omit<Producto, 'idProducto'> = {
    nombre: '',
    descripcion: '',
    precioCompra: 0,
    precioVenta: 0,
    stock: 0,
    stockMinimo: 0
  };

  // LISTAR PRODUCTOS
  cargarProductos(): void {
    this.cargandoProductos = true;
    this.errorProductos = '';

    this.productoService.obtenerProductos().subscribe({

      next: (datos) => {
        this.productos = datos;
        this.cargandoProductos = false;
        this.cdr.detectChanges();

        console.log('Productos recibidos:', datos);
      },

      error: (error) => {
        console.error('Error al obtener productos:', error);

        this.errorProductos = 'No se pudieron cargar los productos.';
        this.cargandoProductos = false;
        this.cdr.detectChanges();
      }

    });
  }

  // ABRIR FORMULARIO PARA NUEVO PRODUCTO
  abrirFormularioProducto(): void {
    this.productoEnEdicion = null;

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

  // EDITAR PRODUCTO
  editarProducto(producto: Producto): void {
    this.productoEnEdicion = producto.idProducto;

    this.nuevoProducto = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioCompra: producto.precioCompra,
      precioVenta: producto.precioVenta,
      stock: producto.stock,
      stockMinimo: producto.stockMinimo
    };

    this.mostrarFormularioProducto = true;
  }

  // CERRAR FORMULARIO DE PRODUCTOS
  cerrarFormularioProducto(): void {
    this.mostrarFormularioProducto = false;
    this.productoEnEdicion = null;
  }

  // GUARDAR O ACTUALIZAR PRODUCTO
  guardarProducto(): void {

    if (!this.nuevoProducto.nombre.trim()) {
      alert('Ingresá el nombre del producto.');
      return;
    }

    // ACTUALIZAR PRODUCTO EXISTENTE
    if (this.productoEnEdicion !== null) {

      const productoActualizado: Producto = {
        idProducto: this.productoEnEdicion,
        ...this.nuevoProducto
      };

      this.productoService.modificarProducto(
        this.productoEnEdicion,
        productoActualizado
      ).subscribe({

        next: () => {
          alert('Producto actualizado correctamente');

          this.cerrarFormularioProducto();
          this.cargarProductos();
        },

        error: (error) => {
          console.error('Error al actualizar producto:', error);
          alert('No se pudo actualizar el producto.');
        }

      });

    } else {

      // REGISTRAR PRODUCTO NUEVO
      this.productoService.guardarProducto(
        this.nuevoProducto
      ).subscribe({

        next: () => {
          alert('Producto registrado correctamente');

          this.cerrarFormularioProducto();
          this.cargarProductos();
        },

        error: (error) => {
          console.error('Error al registrar producto:', error);
          alert('No se pudo registrar el producto.');
        }

      });
    }
  }

  // ELIMINAR PRODUCTO
  eliminarProducto(producto: Producto): void {

    const confirmar = confirm(
      `¿Estás seguro de eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.productoService.eliminarProducto(
      producto.idProducto
    ).subscribe({

      next: () => {
        alert('Producto eliminado correctamente');
        this.cargarProductos();
      },

      error: (error) => {
        console.error('Error al eliminar producto:', error);

        alert(
          'No se pudo eliminar el producto. Puede estar asociado a una venta.'
        );
      }

    });
  }

  // =====================================
  // CLIENTES
  // =====================================

  clientes: Cliente[] = [];

  mostrarFormularioCliente = false;
  clienteEnEdicion: number | null = null;

  nuevoCliente = {
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    direccion: ''
  };

  // LISTAR CLIENTES
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

  // ABRIR FORMULARIO PARA NUEVO CLIENTE
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

  // EDITAR CLIENTE
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

  // GUARDAR O ACTUALIZAR CLIENTE
  guardarCliente(): void {

    if (
      !this.nuevoCliente.nombre.trim() ||
      !this.nuevoCliente.apellido.trim() ||
      !this.nuevoCliente.dni.trim()
    ) {
      alert('Completá nombre, apellido y DNI.');
      return;
    }

    // ACTUALIZAR CLIENTE
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

      // REGISTRAR CLIENTE NUEVO
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
  // ELIMINAR CLIENTE
  // =====================================

  eliminarCliente(cliente: Cliente): void {

    const confirmar = confirm(
      `¿Estás seguro de eliminar al cliente "${cliente.nombre} ${cliente.apellido}"?`
    );

    if (!confirmar) {
      return;
    }

    this.fiadoService.eliminarCliente(
      cliente.idCliente
    ).subscribe({

      next: () => {
        alert('Cliente eliminado correctamente');
        this.cargarClientes();
      },

      error: (error) => {
        console.error('Error al eliminar cliente:', error);
        alert('No se pudo eliminar el cliente. Puede tener fiados asociados.');
      }

    });
  }
  // =====================================
  // FIADOS
  // =====================================

  fiados: Fiado[] = [];

  cargandoFiados = false;
  errorFiados = '';

  get cantidadFiadosPendientes(): number {
    return this.fiados.filter(
      fiado => fiado.saldo > 0
    ).length;
  }

  // LISTAR FIADOS
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
  // REGISTRAR FIADOS
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

    this.cargarClientes();
  }

  cerrarFormularioFiado(): void {
    this.mostrarFormularioFiado = false;
  }

  guardarFiado(): void {

    if (
      this.nuevoFiado.idCliente <= 0 ||
      this.nuevoFiado.monto <= 0
    ) {
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
        alert('No se pudo registrar el fiado.');
      }

    });
  }

  // =====================================
  // REGISTRAR PAGOS DE FIADOS
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
      alert(
        'El importe debe ser mayor a cero y no superar el saldo pendiente.'
      );
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
        alert('No se pudo registrar el pago.');
      }

    });
  }

} // FIN DE LA CLASE APP
