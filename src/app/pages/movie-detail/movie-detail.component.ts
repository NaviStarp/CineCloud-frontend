import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent as HeaderComponent } from "../../general/header/header.component";
import { VideoPlayerComponent } from "../../general/video-player/video-player.component";
import { MediaCarouselComponent } from "../media-gallery/media-carousel/media-carousel.component";
import { faCheck, faEdit, faPlay, faShareAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DeleteModalComponent } from "../../general/delete-modal/delete-modal.component";
import { EditModalComponent } from "../../general/edit-modal/edit-modal.component";

@Component({
  selector: 'app-movie-detail',
  imports: [CommonModule, HeaderComponent, VideoPlayerComponent, MediaCarouselComponent, FaIconComponent, DeleteModalComponent, EditModalComponent],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  animations: [
    trigger('VideoAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('hidden => visible', [
        animate('300ms ease-out')
      ]),
      transition('visible => hidden', [
        animate('200ms ease-in')
      ])
    ])
  ]
  
})
export class MovieDetailComponent implements OnInit {
  id!: string;
  title: string = 'Cargando...';
  description: string = 'Cargando...';
  imageUrl: string = '';
  duration: string = '';
  releaseDate: string = '2023-01-01';
  categories: string[] = [];
  hlsUrl: string = '';
  @ViewChild('VideoPlayer') videoPlayer: VideoPlayerComponent | undefined;
  peliculas: any[] = [];
  series: any[] = [];
  showVideo: boolean = false;
  loading: boolean = true;
  showToolTip: boolean = false;
  showDeleteModal: boolean = false;
  showEditModal: boolean = false;
  selectedView: string = 'description';
  animationDone: boolean = false;
  isAdmin: boolean = false;
  // Iconos
  faPlay = faPlay;
  faCheck = faCheck;
  faEdit = faEdit;
  faTrash = faTrash;
  faShare = faShareAlt;

  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    // Escuchar cambios en los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadMovieData();
    });
    this.auth.isAdmin().then((isAdmin) => {
      this.isAdmin = isAdmin;
    });

    // Cargar las listas de películas y series
    this.auth.getVideos().then((data: any) => {
      this.peliculas = data.peliculas;
      this.series = data.series;
    }).catch((error: any) => {
      console.error('Error loading videos:', error);
    });
  }


   loadMovieData(): void {
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
  showVideoPlayer(): void {
    if (this.videoPlayer) {
      this.videoPlayer.videoUrl = this.hlsUrl;
      this.videoPlayer.videoTitle = this.title;
      this.videoPlayer.episodeInfo = this.description;
      this.showVideo = true;
      this.videoPlayer?.reloadVideo()
    }
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
  
  onVideoClosed() {
    this.showVideo = false;
    this.animationDone = false;
  }
  
  onAnimationDone() {
    if (!this.showVideo) {
      this.animationDone = true;
    }
  }
  
}
