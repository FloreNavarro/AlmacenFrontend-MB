# Almacén - Backend

Aplicación para gestión de almacén desarrollada con Spring Boot y Java 21.

## Requisitos Previos

- **Java JDK:** 21 LTS
- **Motor de Base de Datos:** MySQL 8.4 LTS
- **Gestor de Dependencias:** Maven 3.9+

## Estructura del Proyecto

El paquete raíz es `ies.belgrano.almacen` con la siguiente arquitectura en capas:

- `controller`: Controladores REST que exponen los endpoints HTTP.
- `dto`: Objetos de transferencia de datos para solicitudes y respuestas.
- `entity`: Entidades JPA mapeadas a las tablas de la base de datos MySQL.
- `repository`: Interfaces de acceso a datos que extienden `JpaRepository`.
- `service`: Lógica de negocio y transaccionalidad.
- `exception`: Manejo centralizado de excepciones (`GlobalExceptionHandler`).
- `security`: Configuración de seguridad y control de acceso (`SecurityConfig`).

## Configuración y Variables de Entorno

La conexión a la base de datos en `src/main/resources/application.properties` se encuentra parametrizada para no versionar credenciales reales. Podés configurar las siguientes variables de entorno en tu sistema o sesión de PowerShell:

| Variable | Valor por defecto | Descripción |
| :--- | :--- | :--- |
| `PORT` | `8080` | Puerto del servidor HTTP |
| `DB_HOST` | `localhost` | Host del servidor MySQL |
| `DB_PORT` | `3306` | Puerto de MySQL |
| `DB_NAME` | `almacen_db` | Nombre de la base de datos |
| `DB_USERNAME` | `root` | Usuario de MySQL |
| `DB_PASSWORD` | *(vacío)* | Contraseña del usuario |

## Ejecución con PowerShell

```powershell
# Definir variables si tus credenciales locales difieren de las por defecto:
$env:DB_NAME="almacen_db"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="tu_password_local"

# Ejecutar la aplicación con Maven:
mvn spring-boot:run
```
