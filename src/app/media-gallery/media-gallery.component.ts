// media-gallery.component.ts
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
  opcionSeleccionada: string = 'Todos'; // Default value
  peliculas: Media[] = [];
  series: Media[] = [];
  loading: boolean = true;
  
  // Maps to store unique media by category and ID
  peliculasPorCategoria: Record<string, Map<string, Media>> = {};
  seriesPorCategoria: Record<string, Map<string, Media>> = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    Promise.all([
      this.authService.getCategories(),
      this.authService.getVideos()
    ])
    .then(([categories, videos]: [string[], { peliculas: Media[], series: Media[] }]) => {
      this.categorias = categories;
      this.peliculas = videos.peliculas;
      this.series = videos.series;
      this.groupMediaByCategory();
    })
    .catch((error: any) => {
      console.error('Error loading data:', error);
    })
    .finally(() => {
      this.loading = false;
    });
  }

  onCategoryChange(category: string): void {
    this.opcionSeleccionada = category;
  }

  /**
   * Filter media by category while ensuring uniqueness by ID
   * @param category Category to filter by
   * @param mediaList List of media items to filter
   * @returns Filtered media list with unique items
   */
  private filterByCategory(category: string, mediaList: Media[]): Media[] {
    if (category === 'Todos') {
      return mediaList;
    }
    
    // Use a Map to ensure uniqueness by ID
    const uniqueMedia = new Map<string, Media>();
    
    mediaList.forEach(item => {
      if (item.categorias && item.categorias.includes(category) && !uniqueMedia.has(item.id)) {
        uniqueMedia.set(item.id, item);
      }
    });
    
    return Array.from(uniqueMedia.values());
  }

  /**
   * Wrapper method for template usage to filter media by category
   */
  filterCategories(category: string, mediaList: Media[]): Media[] {
    return this.filterByCategory(category, mediaList);
  }

  /**
   * Group all media by their categories, ensuring no duplicates
   */
  groupMediaByCategory(): void {
    // Initialize category maps
    this.peliculasPorCategoria = {};
    this.seriesPorCategoria = {};
    
    this.categorias.forEach(categoria => {
      // Create Maps to store unique media by ID for each category
      this.peliculasPorCategoria[categoria] = new Map<string, Media>();
      this.seriesPorCategoria[categoria] = new Map<string, Media>();
      
      // Process movies for this category
      this.peliculas.forEach(pelicula => {
        if (pelicula.categorias && pelicula.categorias.includes(categoria)) {
          this.peliculasPorCategoria[categoria].set(pelicula.id, pelicula);
        }
      });
      
      // Process series for this category
      this.series.forEach(serie => {
        if (serie.categorias && serie.categorias.includes(categoria)) {
          this.seriesPorCategoria[categoria].set(serie.id, serie);
        }
      });
    });
  }

  /**
   * Get filtered movies based on selected category as array
   */
  get filteredPeliculas(): Media[] {
    if (this.opcionSeleccionada === 'Todos') {
      // Return all unique movies
      const uniquePeliculas = new Map<string, Media>();
      this.peliculas.forEach(pelicula => {
        uniquePeliculas.set(pelicula.id, pelicula);
      });
      return Array.from(uniquePeliculas.values());
    } else {
      // Return category-filtered movies
      return Array.from(this.peliculasPorCategoria[this.opcionSeleccionada]?.values() || []);
    }
  }

  /**
   * Get filtered series based on selected category as array
   */
  get filteredSeries(): Media[] {
    if (this.opcionSeleccionada === 'Todos') {
      // Return all unique series
      const uniqueSeries = new Map<string, Media>();
      this.series.forEach(serie => {
        uniqueSeries.set(serie.id, serie);
      });
      return Array.from(uniqueSeries.values());
    } else {
      // Return category-filtered series
      return Array.from(this.seriesPorCategoria[this.opcionSeleccionada]?.values() || []);
    }
  }

  /**
   * Get movies for a specific category as array
   */
  getPeliculasForCategory(categoria: string): Media[] {
    return Array.from(this.peliculasPorCategoria[categoria]?.values() || []);
  }

  /**
   * Get series for a specific category as array
   */
  getSeriesForCategory(categoria: string): Media[] {
    return Array.from(this.seriesPorCategoria[categoria]?.values() || []);
  }

  /**
   * Check if a category has any movies or series
   */
  hasMediaInCategory(categoria: string): boolean {
    const hasPeliculas = (this.peliculasPorCategoria[categoria]?.size ?? 0) > 0;
    const hasSeries = (this.seriesPorCategoria[categoria]?.size ?? 0) > 0;
    return hasPeliculas || hasSeries;
  }
}