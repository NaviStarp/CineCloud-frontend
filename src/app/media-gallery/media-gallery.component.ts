import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../general/header/header.component';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../general/loading/loading.component";
import { MediaCarouselComponent } from "./media-carousel/media-carousel.component";
import { RouterModule } from '@angular/router';

interface Media {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  duracion: string;
  fecha_estreno: string;
  categorias: string[];
}

@Component({
  selector: 'app-media-gallery',
  imports: [
    CommonModule,
    MediaCarouselComponent,
    LoadingComponent,
    RouterModule,
    HeaderComponent
  ],
  standalone: true,
  templateUrl: './media-gallery.component.html',
  styleUrl: './media-gallery.component.css'
})
export class MediaGalleryComponent implements OnInit {
  categorias: string[] = [];
  opcionSeleccionada: string = 'Todos'; // Valor por defecto
  peliculas: Media[] = [];
  series: Media[] = [];
  loading: boolean = true;
  
  // Mapas para almacenar medios únicos por categoría e ID
  peliculasPorCategoria: Record<string, Map<string, Media>> = {};
  seriesPorCategoria: Record<string, Map<string, Media>> = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    // Inicia la carga de categorías y videos en paralelo
    const categoriesPromise = this.authService.getCategories();
    const videosPromise = this.authService.getVideos();

    // Procesa las categorías tan pronto como estén disponibles
    categoriesPromise
      .then(categories => {
        this.categorias = categories;
      })
      .catch(error => {
        console.error('Error al cargar las categorías:', error);
      });

    // Procesa los videos tan pronto como estén disponibles
    videosPromise
      .then(videos => {
        this.peliculas = videos.peliculas;
        this.series = videos.series;
        this.groupMediaByCategory();
      })
      .catch(error => {
        console.error('Error al cargar los videos:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onCategoryChange(category: string): void {
    this.opcionSeleccionada = category;
  }

  /**
   * Filtra los medios por categoría asegurando que sean únicos por ID
   * @param category Categoría por la cual filtrar
   * @param mediaList Lista de medios a filtrar
   * @returns Lista de medios filtrados y únicos
   */
  private filterByCategory(category: string, mediaList: Media[]): Media[] {
    if (category === 'Todos') {
      return mediaList;
    }
    
    // Usa un Map para garantizar unicidad por ID
    const uniqueMedia = new Map<string, Media>();
    
    mediaList.forEach(item => {
      if (item.categorias && item.categorias.includes(category) && !uniqueMedia.has(item.id)) {
        uniqueMedia.set(item.id, item);
      }
    });
    
    return Array.from(uniqueMedia.values());
  }

  /**
   * Método de envoltura para usar en la plantilla y filtrar medios por categoría
   */
  filterCategories(category: string, mediaList: Media[]): Media[] {
    return this.filterByCategory(category, mediaList);
  }

  /**
   * Agrupa todos los medios por sus categorías, asegurando que no haya duplicados
   */
  groupMediaByCategory(): void {
    // Inicializa los mapas de categorías
    this.peliculasPorCategoria = {};
    this.seriesPorCategoria = {};
    
    this.categorias.forEach(categoria => {
      // Crea mapas para almacenar medios únicos por ID para cada categoría
      this.peliculasPorCategoria[categoria] = new Map<string, Media>();
      this.seriesPorCategoria[categoria] = new Map<string, Media>();
      
      // Procesa las películas para esta categoría
      this.peliculas.forEach(pelicula => {
        if (pelicula.categorias && pelicula.categorias.includes(categoria)) {
          this.peliculasPorCategoria[categoria].set(pelicula.id, pelicula);
        }
      });
      
      // Procesa las series para esta categoría
      this.series.forEach(serie => {
        if (serie.categorias && serie.categorias.includes(categoria)) {
          this.seriesPorCategoria[categoria].set(serie.id, serie);
        }
      });
    });
  }

  /**
   * Obtiene las películas filtradas según la categoría seleccionada como un array
   */
  get filteredPeliculas(): Media[] {
    if (this.opcionSeleccionada === 'Todos') {
      // Retorna todas las películas únicas
      const uniquePeliculas = new Map<string, Media>();
      this.peliculas.forEach(pelicula => {
        uniquePeliculas.set(pelicula.id, pelicula);
      });
      return Array.from(uniquePeliculas.values());
    } else {
      // Retorna las películas filtradas por categoría
      return Array.from(this.peliculasPorCategoria[this.opcionSeleccionada]?.values() || []);
    }
  }

  /**
   * Obtiene las series filtradas según la categoría seleccionada como un array
   */
  get filteredSeries(): Media[] {
    if (this.opcionSeleccionada === 'Todos') {
      // Retorna todas las series únicas
      const uniqueSeries = new Map<string, Media>();
      this.series.forEach(serie => {
        uniqueSeries.set(serie.id, serie);
      });
      return Array.from(uniqueSeries.values());
    } else {
      // Retorna las series filtradas por categoría
      return Array.from(this.seriesPorCategoria[this.opcionSeleccionada]?.values() || []);
    }
  }

  /**
   * Obtiene las películas para una categoría específica como un array
   */
  getPeliculasForCategory(categoria: string): Media[] {
    return Array.from(this.peliculasPorCategoria[categoria]?.values() || []);
  }

  /**
   * Obtiene las series para una categoría específica como un array
   */
  getSeriesForCategory(categoria: string): Media[] {
    return Array.from(this.seriesPorCategoria[categoria]?.values() || []);
  }

  /**
   * Verifica si una categoría tiene películas o series
   */
  hasMediaInCategory(categoria: string): boolean {
    const hasPeliculas = (this.peliculasPorCategoria[categoria]?.size ?? 0) > 0;
    const hasSeries = (this.seriesPorCategoria[categoria]?.size ?? 0) > 0;
    return hasPeliculas || hasSeries;
  }
}