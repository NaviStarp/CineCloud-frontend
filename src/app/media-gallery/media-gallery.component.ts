// media-gallery.component.ts
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../general/header/header.component';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MediaCardComponent } from "./media-card/media-card.component";
import { LoadingComponent } from "../general/loading/loading.component";

interface Media {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  fecha_estreno: string;
  categorias: string[];
}

@Component({
  selector: 'app-media-gallery',
  imports: [HeaderComponent, CommonModule, MediaCardComponent, LoadingComponent],
  standalone: true,
  templateUrl: './media-gallery.component.html',
  styleUrl: './media-gallery.component.css'
})
export class MediaGalleryComponent implements OnInit {
  categorias: string[] = [];
  opcionSeleccionada: string | null = null;
  peliculas: Media[] = [];
  series: Media[] = [];
  loading: boolean = true;
  
  // Filtered media based on selected category
  peliculasFiltradas: Media[] = [];
  seriesFiltradas: Media[] = [];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    Promise.all([
      this.auth.getCategories(),
      this.auth.getVideos()
    ]).then(([categories, videos]: [string[], any]) => {
      this.categorias = categories;
      this.peliculas = videos.peliculas;
      this.series = videos.series;
    }).catch((error: any) => {
      console.error('Error loading data:', error);
    }).finally(() => {
      console.log('All data loaded');
      this.loading = false;
    });
  }

  loadCategorias() {
    this.auth.getCategories().then((data: string[]) => {
      this.categorias = data;
      // Set default selection to first category
      this.filterMediaByCategory();
    }).catch((error: any) => {
      console.error('Error loading categories:', error);
    });
  }

  loadMedia() {
    this.auth.getVideos().then((data: any) => {
      this.peliculas = data.peliculas;
      this.series = data.series;
      console.log(this.peliculas);
      console.log(this.series);
      this.filterMediaByCategory();
    }).catch((error: any) => {
      console.error('Error loading media:', error);
    });
  }

  onCategoryChange(category: string): void {
    this.opcionSeleccionada = category;
    this.filterMediaByCategory();
  }
  filterCategorie(category: string, media: any[]): any[] {
    return media.filter((item) => 
      item.categorias && item.categorias.includes(category)
    ) || [];
  }

  filterMediaByCategory(): void {
    if (!this.opcionSeleccionada) return;
    
    this.peliculasFiltradas = this.peliculas.filter(pelicula => 
      pelicula.categorias && pelicula.categorias.includes(this.opcionSeleccionada!)
    );
    
    this.seriesFiltradas = this.series.filter(serie => 
      serie.categorias && serie.categorias.includes(this.opcionSeleccionada!)
    );
  }
}