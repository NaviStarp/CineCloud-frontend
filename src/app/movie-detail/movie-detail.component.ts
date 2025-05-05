import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent as HeaderComponent } from "../general/header/header.component";
import { VideoPlayerComponent } from "../general/video-player/video-player.component";
import { MediaCarouselComponent } from "../media-gallery/media-carousel/media-carousel.component";
import { faCheck, faPlay, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-movie-detail',
  imports: [CommonModule, HeaderComponent, VideoPlayerComponent, MediaCarouselComponent,FaIconComponent],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit {
  id!: string;
  title: string = 'Movie Detail';
  description: string = 'Movie Description';
  imageUrl: string = '';
  duration: string = '';
  releaseDate: string = '2023-01-01';
  categories: string[] = [];
  hlsUrl: string = '';

  peliculas: any[] = [];
  series: any[] = [];
  showVideo: boolean = false;
  loading: boolean = true;
  showToolTip: boolean = false;
  selectedView: string = 'description';
  // Iconos
  faPlay = faPlay;
  faCheck = faCheck;
  faShare = faShareAlt;

  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    // Escuchar cambios en los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadMovieData();
    });

    // Cargar las listas de películas y series
    this.auth.getVideos().then((data: any) => {
      this.peliculas = data.peliculas;
      this.series = data.series;
    }).catch((error: any) => {
      console.error('Error loading videos:', error);
    });
  }

  private loadMovieData(): void {
    this.loading = true;
    this.auth.getMovie(this.id).then((data: any) => {
      this.title = data.titulo;
      this.description = data.descripcion;
      this.imageUrl = data.imagen;
      this.releaseDate = data.fecha_estreno;
      this.duration = data.duracion;
      this.categories = data.categorias;
      this.hlsUrl = data.video;
      this.loading = false;
    }).catch((error: any) => {
      console.error('Error loading movie data:', error);
      this.loading = false;
    });
  }

  copyUrlToClipboard(): void {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
    }).catch((error) => {
      console.error('Error copying URL to clipboard:', error);
    });
  }

  filterMediaByRelation(): any[] {
    const relatedMedia = [...this.peliculas, ...this.series]
      .filter((media) => {
        return this.categories.some((category) => 
          media.categorias?.includes(category)) && media.id !== +this.id;
      })
      .filter((media, index, self) =>
        index === self.findIndex((m) => m.id === media.id)
      );
    return relatedMedia;
  }
}
