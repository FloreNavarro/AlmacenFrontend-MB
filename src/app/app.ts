import { Component, HostListener } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
export class App {

  opcionSeleccionada = 'Inicio';

  esPantallaPequena = window.innerWidth <= 800;

  @HostListener('window:resize')
  alCambiarTamano(): void {
    this.esPantallaPequena = window.innerWidth <= 800;
  }

  seleccionarOpcion(opcion: string): void {
    this.opcionSeleccionada = opcion;
  }

}