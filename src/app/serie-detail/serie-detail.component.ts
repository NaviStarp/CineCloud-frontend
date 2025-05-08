import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../general/header/header.component';
import { VideoPlayerComponent } from '../general/video-player/video-player.component';
import { MediaCarouselComponent } from '../media-gallery/media-carousel/media-carousel.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { faCheck, faPlay, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { EpisodeListComponent } from "./episode-list/episode-list.component";

@Component({
  selector: 'app-serie-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, VideoPlayerComponent, MediaCarouselComponent, 
           FaIconComponent, EpisodeListComponent, FormsModule],
  templateUrl: './serie-detail.component.html',
  styleUrl: './serie-detail.component.css'
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
  selectedView: string = 'episodes';
  showToolTip: boolean = false;
  hlsUrl: string = '';
  videoTitle: string = '';
  videoDescription: string = '';
  // Iconos
  faPlay = faPlay;
  faCheck = faCheck;
  faShare = faShareAlt;
  
  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadSerieData();
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
              ...ep,
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
    this.hlsUrl = episode.video || episode.videoUrl;
    this.videoTitle = episode.titulo || episode.title || 'No Title';
    this.videoDescription = episode.descripcion || episode.description || 'No Description';
    this.showVideo = true;
  }
}