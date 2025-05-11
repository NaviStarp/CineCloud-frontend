import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { VideoPlayerComponent } from '../../general/video-player/video-player.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { faCheck, faEdit, faPlay, faShareAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { EpisodeListComponent } from "./episode-list/episode-list.component";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MediaCarouselComponent } from '../media-gallery/media-carousel/media-carousel.component';
import { DeleteModalComponent } from "../../general/delete-modal/delete-modal.component";
import { EditModalComponent } from "../../general/edit-modal/edit-modal.component";
import { HeaderComponent } from '../../general/header/header.component';

@Component({
  selector: 'app-serie-detail',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    VideoPlayerComponent, 
    MediaCarouselComponent,
    FontAwesomeModule, 
    EpisodeListComponent, 
    FormsModule, 
    DeleteModalComponent, 
    EditModalComponent
  ],
  templateUrl: './serie-detail.component.html',
  styleUrls: ['./serie-detail.component.css'],
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
export class SerieDetailComponent implements OnInit {
  id!: string;
  title: string = 'Cargando';
  description: string = 'Cargando';
  imageUrl: string = '';
  season: number = 1; 
  temporadas: number = 1;
  releaseDate: string = '2023-01-01';
  categories: string[] = [];
  episodes: any[] = [];
  peliculas: any[] = [];
  series: any[] = [];
  showVideo: boolean = false;
  loading: boolean = true;
  animationDone: boolean = false;
  selectedView: string = 'episodes';
  isMobile: boolean = window.innerWidth < 700;
  showFullDescription: boolean = false;
  showToolTip: boolean = false;
  showDeleteModal: boolean = false;
  editModal: boolean = false;
  isAdmin: boolean = false;
  hlsUrl: string = '';
  videoTitle: string = '';
  videoDescription: string = '';
  
  @ViewChild('videoPlayer') videoPlayer!: VideoPlayerComponent;
  
  // Iconos
  faPlay = faPlay;
  faTrash = faTrash;
  faEdit = faEdit;
  faCheck = faCheck;
  faShare = faShareAlt;
  
  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth < 700;
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadSerieData();
    });
    
    this.auth.isAdmin().then((isAdmin) => {
      this.isAdmin = isAdmin;
    });
    
    try {
      const data = await this.auth.getVideos();
      if (data) {
        this.peliculas = data.peliculas || [];
        this.series = data.series || [];
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  }

  async loadSerieData(): Promise<void> {
    this.loading = true;
    
    try {
      const data = await this.auth.getSerie(this.id);
      
      if (data) {
        this.title = data.titulo || 'No Title';
        this.description = data.descripcion || 'No Description';
        this.imageUrl = data.imagen || '';
        this.releaseDate = data.fecha_estreno || '';
        this.categories = data.categorias || [];
        this.temporadas = data.temporadas || 1;
        this.season = this.temporadas;  
        
        if (data.episodios && Array.isArray(data.episodios)) {
          this.episodes = data.episodios.map((ep: any) => {
            return {
              id: ep.id || '',
              season: ep.temporada || 1,
              temporada: ep.temporada || 1, 
              episode: ep.numero || 0,
              numero: ep.numero || 0, 
              title: ep.titulo || `Episode ${ep.numero || 'Unknown'}`,
              titulo: ep.titulo || `Episode ${ep.numero || 'Unknown'}`, 
              description: ep.descripcion || '',
              descripcion: ep.descripcion || '', 
              imageUrl: ep.imagen || '',
              imagen: ep.imagen || '', 
              duration: ep.duracion || 0,
              duracion: ep.duracion || 0, 
              videoUrl: ep.video || '',
              video: ep.video || '' 
            };
          });
          
          if (this.episodes.length > 0) {
            this.hlsUrl = this.episodes[0].video || this.episodes[0].videoUrl || '';
          }
        } else {
          this.episodes = [];
        }
      }
    } catch (error) {
      console.error('Error loading serie:', error);
    } finally {
      this.loading = false;
    }
  }
  
  copyUrlToClipboard(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.showToolTip = true;
      setTimeout(() => {
        this.showToolTip = false;
      }, 2000);
    }).catch(err => {
      console.error('Error copying URL to clipboard:', err);
    });
  }
  
  showVideoPlayer(episode: any): void {
    this.hlsUrl = episode.video || episode.videoUrl;
    this.showVideo = true;
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

  selectEpisode(episode: any): void {
    if (!episode) {
      console.error('No episode selected');
      return;
    }
    console.log('Selected episode:', episode);
    
    this.hlsUrl = episode.video || episode.videoUrl;
    
    // Si el reproductor ya está inicializado, actualizamos sus propiedades
    if (this.videoPlayer) {
      this.videoPlayer.videoUrl = episode.video || episode.videoUrl;
      this.videoPlayer.videoId = episode.id;
      this.videoPlayer.videoTitle = this.title;
      this.videoPlayer.episodeInfo = `${episode.season || episode.temporada}x${episode.episode || episode.numero} - ${episode.title || episode.titulo}`;
      this.videoPlayer.reloadVideo();
    }
    
    this.showVideo = true;
  }
  
  onVideoClosed(): void {
    this.showVideo = false;
    this.animationDone = false;
  }
  
  onAnimationDone(): void {
    if (!this.showVideo) {
      this.animationDone = true;
    }
  }
}