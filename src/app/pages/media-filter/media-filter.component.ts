import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from "../../general/header/header.component";
import { MediaCardComponent } from "../media-gallery/media-card/media-card.component";
import { LoadingComponent } from "../../general/loading/loading.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-media-filter',
  imports: [HeaderComponent, MediaCardComponent, CommonModule,RouterLink],
  templateUrl: './media-filter.component.html',
  styleUrl: './media-filter.component.css'
})
export class MediaFilterComponent {
  constructor(private route: ActivatedRoute, private auth: AuthService) { }
  media: any[] = [];
  mediaType: string = '';
  isLoading: boolean = true;
  terminoBusqueda: string = '';
  mediaFiltrada: any[] = [];

  async ngOnInit() {
    this.mediaType = this.route.snapshot.data['type'];
    await this.getMedia();
    this.mediaFiltrada = this.media; // Inicialmente, la lista filtrada es igual a la lista completa
    this.isLoading = false;
  }

  async getMedia() {
    if (this.mediaType === 'movies') {
      this.media = await this.auth.getMovies();
      this.media.forEach(item => item.type = 'pelicula');
    } else if (this.mediaType === 'series') {
      this.media = await this.auth.getSeries();
      this.media.forEach(item => item.type = 'serie');
    }
  }

  /**
   * Maneja el evento de cambio en la búsqueda
   * @param busqueda La cadena de búsqueda
   */
  onBusquedaCambio(busqueda: string): void {
    this.terminoBusqueda = busqueda;
    this.actualizarMediaFiltrada();
  }

  /**
   * Actualiza la lista de medios filtrados basándose en el término de búsqueda
   */
  private actualizarMediaFiltrada(): void {
    if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
      this.mediaFiltrada = this.media; // Si no hay búsqueda, mostrar todos los medios
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase().trim();
    this.mediaFiltrada = this.media.filter(item =>
      item.titulo.toLowerCase().includes(termino) ||
      item.descripcion.toLowerCase().includes(termino)
    );
  }
}
