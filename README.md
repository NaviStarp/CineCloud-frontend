# CineCloud

CineCloud es una aplicación web desarrollada con Angular que permite [breve descripción de la aplicación].

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v14.x o superior)
- [npm](https://www.npmjs.com/) (generalmente viene con Node.js)
- [Angular CLI](https://angular.io/cli) (para herramientas de desarrollo)

## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/NaviStarp/CineCloud-frontend.git
   cd CineCloud-frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## Iniciar el servidor de desarrollo

Para iniciar un servidor de desarrollo local:

```bash
ng serve
```

Una vez que el servidor esté en funcionamiento, abre tu navegador y ve a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

Para especificar un puerto diferente:

```bash
ng serve --port 4201
```

## Construcción para producción

Para compilar el proyecto para producción:

```bash
ng build --prod
```

Los archivos de la compilación se almacenarán en el directorio `dist/`.

## Pruebas

### Pruebas unitarias

Para ejecutar pruebas unitarias:

```bash
ng test
```

### Pruebas end-to-end

Para ejecutar pruebas end-to-end:

```bash
ng e2e
```

## Estructura del proyecto

```
cinecloud/
├── src/                 # Código fuente
│   ├── app/            # Componentes, servicios, etc.
│   ├── assets/         # Imágenes, fuentes, etc.
│   └── environments/   # Variables de entorno
├── angular.json        # Configuración de Angular
├── package.json        # Dependencias y scripts
└── README.md           # Este archivo
```

## Problemas comunes

- **Error: Port 4200 is already in use**
  - Solución: Utiliza un puerto diferente con `ng serve --port 4201`

- **Error al instalar dependencias**
  - Solución: Intenta borrar `node_modules` y `package-lock.json` y luego ejecuta `npm install` nuevamente

## Recursos adicionales

- [Documentación oficial de Angular](https://angular.dev/)
- [Documentación de Angular CLI](https://angular.dev/tools/cli)

