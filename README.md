# Almacén Frontend - Dashboard de Demostración

Aplicación frontend para el sistema de **Gestión de Almacén**, implementada con **Angular 21 standalone**, **CSS** y **Angular Material**.

## Alcance del Incremento

- **Dashboard de prueba visual:** Incluye barra lateral izquierda, encabezado con el título *"Gestión de Almacén"*, mensaje de bienvenida y tarjetas demostrativas rotuladas como `[DEMOSTRACIÓN]`.
- **Navegación reactiva:** Menú lateral accesible por teclado con opciones:
  - **Inicio**
  - **Productos**
  - **Ventas**
  - **Clientes**
- **Diseño Adaptativo (Responsive):** La barra lateral se ajusta para escritorio (fijada y visible) y dispositivos móviles (colapsable con botón hamburguesa).
- **Accesibilidad:** Soporta navegación por teclado, foco visible (`:focus-visible`), atributos `aria-label`, `aria-current` y `aria-expanded`.
- **Sin conexión backend:** Este incremento no realiza llamadas HTTP ni implementa operaciones CRUD/persistencia de datos.

---

## Requisitos Previos

- **Node.js:** v24.14.1 (o versión LTS compatible con Angular 21)
- **npm:** 11.x o superior

---

## Instalación y Ejecución con PowerShell

Desde la raíz del repositorio (`AlmacenFrontend-MB`):

### 1. Instalar dependencias
```powershell
npm install
```

### 2. Ejecutar el servidor de desarrollo
```powershell
npm start
```
> La aplicación estará disponible en: [http://localhost:4200/](http://localhost:4200/)

### 3. Compilar para producción (opcional)
```powershell
npm run build
```

### 4. Ejecutar pruebas unitarias
```powershell
npm test
```
