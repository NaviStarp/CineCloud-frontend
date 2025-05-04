import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../general/header/header.component';
import { VideoPlayerComponent } from '../general/video-player/video-player.component';
import { MediaCarouselComponent } from '../media-gallery/media-carousel/media-carousel.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MediaCardComponent } from "../media-gallery/media-card/media-card.component";
import { faCheck, faPlay, faShareAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-serie-detail',
  imports: [CommonModule, HeaderComponent, VideoPlayerComponent, MediaCarouselComponent, FaIconComponent, MediaCardComponent],
  templateUrl: './serie-detail.component.html',
  styleUrl: './serie-detail.component.css'
})
export class SerieDetailComponent implements OnInit {
  id!: string;
  title: string = 'Serie Detail';
  description: string = 'Serie Description';
  imageUrl: string = '';
  releaseDate: string = '2023-01-01';
  categories: string[] = [];
  episodes: any[] = [];
  peliculas: any[] = [];
  series: any[] = [];
  showVideo: boolean = false;
  loading: boolean = true;
  showToolTip: boolean = false;
  hlsUrl: string = '';
  // Iconos
  faPlay =  faPlay;
  faCheck = faCheck;
  faShare = faShareAlt;
  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {
    console.log('SerieDetailComponent initialized');
  }

  ngOnInit(): void {
    // Escuchar cambios en los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log('Serie ID from route:', this.id);
      this.loadSerieData();
    });

    // Cargar las listas de películas y series
    this.auth.getVideos().then((data: any) => {
      this.peliculas = data.peliculas;
      this.series = data.series;
    }).catch((error: any) => {
      console.error('Error loading videos:', error);
    });
  }

  loadSerieData(): void {
    this.loading = true;
    this.auth.getSerie(this.id).then((data: any) => {
      this.title = data.titulo;
      this.description = data.descripcion;
      this.imageUrl = data.imagen;
      this.releaseDate = data.fecha_estreno;
      this.categories = data.categorias;
      this.episodes = data.episodios || [];
      this.loading = false;
    }).catch((error: any) => {
      console.error('Error loading serie:', error);
      this.loading = false;
    });
  }
  copyUrlToClipboard(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      console.log('URL copied to clipboard:', url);
      this.showToolTip = true;
      setTimeout(() => {
        this.showToolTip = false;
      }, 2000);
    }).catch(err => {
      console.error('Error copying URL to clipboard:', err);
    });
  }
  showVideoPlayer(episode: any): void {
    this.hlsUrl = episode.video;
    this.showVideo = true;
  }
  }
