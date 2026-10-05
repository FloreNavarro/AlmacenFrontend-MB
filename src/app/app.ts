import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

export type SectionType = 'inicio' | 'productos' | 'ventas' | 'clientes';

export interface MenuItem {
  id: SectionType;
  label: string;
  icon: string;
  ariaLabel: string;
}

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
export class App implements OnInit, OnDestroy {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription?: Subscription;

  // Estado reactivo con Signals
  readonly isMobile = signal<boolean>(false);
  readonly sidenavOpened = signal<boolean>(true);
  readonly currentSection = signal<SectionType>('inicio');

  // Menú lateral de prueba
  readonly menuItems: MenuItem[] = [
    { id: 'inicio', label: 'Inicio', icon: 'dashboard', ariaLabel: 'Ir a sección de Inicio' },
    { id: 'productos', label: 'Productos', icon: 'inventory_2', ariaLabel: 'Ir a sección de Productos' },
    { id: 'ventas', label: 'Ventas', icon: 'point_of_sale', ariaLabel: 'Ir a sección de Ventas' },
    { id: 'clientes', label: 'Clientes', icon: 'people', ariaLabel: 'Ir a sección de Clientes' }
  ];

  ngOnInit(): void {
    this.breakpointSubscription = this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 768px)'])
      .subscribe((result) => {
        const mobile = result.matches;
        this.isMobile.set(mobile);
        // En escritorio se mantiene abierto por defecto; en móvil se cierra
        this.sidenavOpened.set(!mobile);
      });
  }

  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
  }

  toggleSidenav(): void {
    this.sidenavOpened.update((opened) => !opened);
  }

  selectSection(section: SectionType): void {
    this.currentSection.set(section);
    // Si la pantalla es móvil, cerrar el menú tras la selección para facilitar la vista
    if (this.isMobile()) {
      this.sidenavOpened.set(false);
    }
  }

  onSidenavClosed(): void {
    this.sidenavOpened.set(false);
  }
}
