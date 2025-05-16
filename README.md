# Cinecloud Frontend

Cinecloud Frontend es una aplicación desarrollada en Angular que proporciona una interfaz de usuario moderna e intuitiva para interactuar con el backend de Cinecloud. Esta aplicación permite a los usuarios acceder a contenido multimedia, realizar subidas de videos, y disfrutar de streaming de alta calidad para películas y series. Su diseño responsive garantiza una experiencia óptima en diversos dispositivos, mientras que su arquitectura basada en componentes facilita el mantenimiento y la escalabilidad del proyecto.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v14.x o superior)
- **npm** (incluido con Node.js)
- **Angular CLI** (para herramientas de desarrollo)
- [Backend de Cinecloud](https://github.com/NaviStarp/CineCloud-backend)      (necesario para la funcionalidad completa)

## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

1. **Clona el repositorio:**

  ```bash
  git clone https://github.com/NaviStarp/CineCloud-frontend.git
  cd CineCloud-frontend
  ```

2. **Instala las dependencias:**

  ```bash
  npm install
  ```
## Iniciar el servidor de desarrollo

Para iniciar un servidor de desarrollo local:

```bash
ng serve
```

La aplicación estará disponible en [http://localhost:4200/](http://localhost:4200/).

Para especificar un puerto diferente:

```bash
ng serve --port 4201
```

## Construcción para producción

Para compilar el proyecto para un entorno de producción:

```bash
ng build --configuration production
```

Los archivos compilados se almacenarán en el directorio `dist/`.

## Estructura del proyecto
```markdown
├── src/                       # Código fuente principal
│   ├── app/                   # Componentes, servicios y módulos
│   │   ├── app.component.*    # Componente principal de la aplicación
│   │   ├── general/           # Componentes generales reutilizables
│   │   │   ├── delete-modal/  # Modal para eliminar elementos
│   │   │   ├── edit-modal/    # Modal para editar elementos
│   │   │   ├── episode-edit-modal/ # Modal para editar episodios
│   │   │   ├── header/        # Encabezado de la aplicación
│   │   │   ├── loading/       # Indicador de carga
│   │   │   ├── modal-error/   # Modal para mostrar errores
│   │   │   ├── not-authorized/ # Página de acceso no autorizado
│   │   │   ├── progress-bar/  # Barra de progreso
│   │   │   └── video-player/  # Reproductor de video
│   │   ├── login/             # Página de inicio de sesión
│   │   ├── login-signup/      # Componentes para login y registro
│   │   │   ├── button/        # Botón reutilizable
│   │   │   ├── form-footer/   # Pie de formulario
│   │   │   ├── header/        # Encabezado del formulario
│   │   │   ├── input/         # Campo de entrada
│   │   │   ├── login-form/    # Formulario de inicio de sesión
│   │   │   └── signup-form/   # Formulario de registro
│   │   ├── media-list/        # Listado de peliculas y series
│   │   │   └── media-view/    # Vista de un video específico
│   │   ├── not-found/         # Página de error 404
│   │   ├── pages/             # Páginas principales
│   │   │   ├── admin-page/    # Página de administración
│   │   │   ├── media-filter/  # Filtros para peliculas y series
│   │   │   ├── media-form/    # Formulario para peliculas y series
│   │   │   ├── media-gallery/ # Galería de peliculas y series
│   │   │   │   ├── media-card/ # Tarjeta de video
│   │   │   │   ├── media-carousel/ # Carrusel de peliculas y series
│   │   │   │   └── skeleton-loader/ # Cargador esqueleto
│   │   │   ├── media-uploader/ # Subidor de peliculas y series
│   │   │   ├── movie-detail/  # Detalle de película
│   │   │   ├── serie-detail/  # Detalle de serie
│   │   │   │   ├── episode-list/ # Listado de episodios
│   │   │   │   │   └── episode-card/ # Tarjeta de episodio
│   │   │   └── server-config/ # Configuración del servidor
│   │   ├── services/          # Servicios e interceptores
│   │   │   ├── auth.service.* # Servicio de autenticación
│   │   │   ├── admin.guard.*  # Guardia de administrador
│   │   │   ├── auth.guard.*   # Guardia de autenticación
│   │   │   └── theme.service.* # Servicio de temas
│   │   ├── signup/            # Página de registro
│   │   └── video-card/        # Tarjeta de video
│   │       ├── serie-form/    # Formulario de serie
│   │       └── video-form/    # Formulario de video
│   ├── environments/          # Configuraciones de entorno
│   ├── index.html             # Punto de entrada HTML
│   ├── main.*                 # Puntos de entrada de la aplicación
│   └── styles.css             # Estilos globales
├── public/                    # Recursos públicos
│   ├── favicon.ico            # Ícono de la aplicación
│   ├── Logo*.png              # Variantes del logo
├── angular.json               # Configuración de Angular
├── package.json               # Dependencias y scripts
├── package-lock.json          # Bloqueo de dependencias
├── tailwind.config.js         # Configuración de Tailwind CSS
├── tsconfig.*                 # Configuración de TypeScript
├── LICENSE                    # Licencia del proyecto
└── README.md                  # Este archivo
```

## Características principales

- **Autenticación de usuarios:** Sistema completo de registro, inicio de sesión y gestión de perfiles.
- **Reproductor HLS avanzado:** Soporte para streaming adaptativo mediante HTTP Live Streaming.
- **Catálogo interactivo:** Navegación intuitiva por el contenido disponible con filtros y búsquedas.
- **Panel de administración:** Herramientas para la gestión de contenido multimedia.
- **Diseño responsive:** Experiencia optimizada para móviles, tablets y equipos de escritorio.
- **Tema oscuro/claro:** Posibilidad de cambiar entre modos de visualización.

## Módulos principales

- **Auth:** Gestión de autenticación, registro y recuperación de contraseña.
- **Dashboard:** Panel principal con contenido destacado y recomendaciones.
- **Movies:** Visualización y gestión de películas.
- **Series:** Visualización y gestión de series, temporadas y episodios.
- **Profile:** Administración de perfil de usuario y preferencias.

## Pruebas

### Pruebas unitarias

Para ejecutar las pruebas unitarias:

```bash
ng test
```

### Pruebas end-to-end

Para ejecutar las pruebas de integración:

```bash
ng e2e
```

## Problemas comunes

### Error: Puerto 4200 ya está en uso
**Causa**: Otro proceso está utilizando el puerto 4200.  
**Solución**: Utiliza un puerto diferente con el comando:

```bash
ng serve --port 4201
```

### Error al instalar dependencias
**Causa**: Conflictos en el caché de npm o dependencias corruptas.  
**Solución**: Limpia la caché y reinstala las dependencias:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Error de conexión con el backend
**Causa**: El servidor backend no está en ejecución o las variables de entorno están mal configuradas.  
**Solución**: Asegúrate de que el backend esté funcionando y verifica la configuración en `environment.ts`.

---

## Recursos adicionales

- [Documentación oficial de Angular](https://angular.dev/)
- [Documentación de Angular CLI](https://angular.dev/tools/cli)
- [Backend de Cinecloud](https://github.com/NaviStarp/CineCloud-backend)
