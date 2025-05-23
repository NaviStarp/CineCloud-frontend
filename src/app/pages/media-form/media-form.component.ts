import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faFilm, faHome, faPlus, faSpinner, faTv } from '@fortawesome/free-solid-svg-icons';
import { IndexedDbService } from '../../services/indexed-db.service';
import { Router, RouterLink } from '@angular/router';
import { VideoEntry } from '../../services/indexed-db.service';
import { AuthService, Series } from '../../services/auth.service';
import { ProgressBarComponent } from '../../general/progress-bar/progress-bar.component';
import { VideoCardComponent } from '../../video-card/video-card.component';

@Component({
  selector: 'app-media-form',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    VideoCardComponent,
    ProgressBarComponent,
    RouterLink
  ],
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.css']
})
export class MediaFormComponent implements OnInit, AfterViewInit {
  Math = Math;
  faFilm = faFilm;
  faTv = faTv;
  faPlus = faPlus;
  faCheck = faCheck;
  faSpinner = faSpinner;
  faHome = faHome;
  isLoading = false;
  videos: VideoEntry[] = [];
  series: Series[] = [];
  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef;
  @ViewChildren('videoItem') videoItems!: QueryList<VideoCardComponent>;

// Barra de progreso
  progress: number = 0;
  message: string = '';
  isError: boolean = false;
  isWarning: boolean = false;
  isSuccess: boolean = false;
  isQualityRescaleEnabled: boolean = true;


  constructor(private indexedDbService: IndexedDbService, private router: Router,private auth:AuthService) { }

  ngOnInit(): void {
    this.loadVideos();
  }

  ngAfterViewInit(): void {
    this.refreshSeriesInAllComponents();
  }

  refreshSeriesInAllComponents() {
    if (this.videoItems && this.videoItems.length > 0) {
      this.videoItems.forEach((videoItem) => {
        if (videoItem) {
          console.log('Refrescando series en:', videoItem);
          //videoItem.loadSeries()
        }
      });
    } 
  }

  async loadVideos() {
    try {
      this.isLoading = true;
      const files = await this.indexedDbService.getVideos();
      this.videos = await Promise.all(files.map(async (file: any) => {
        // Si el archivo ya es un objeto VideoEntry, usarlo directamente
        if (file.videoBlob) {
          return file as VideoEntry;
        }
        
        return {
          id: file.name, // ID temporal
          videoBlob: file,          
          description: '',
          video: null,
          videoMime: '',
          thumbnail: '',
          name: file.name,
          mediaType: 'Pelicula',
          releaseDate: new Date(),
          chapter: null,
          season: null,
          categories: null,
          seriesId: null,
          seriesName: null,
          seriesDescription: null,
          seriesReleaseDate: new Date(),
        };
      }));
      this.isLoading = false;
    } catch (error) {
      console.error('Error al cargar los videos:', error);
    }
  }
  // Método para manejar cambios en los videos desde VideoFormComponent
  onVideoChanged(updatedVideo: VideoEntry, index: number) {
    console.log('Video actualizado:', updatedVideo);
    this.videos[index] = updatedVideo;
    console.log('Videos:', this.videos);
    // Guardar los cambios en IndexedDB
    this.refreshSeriesInAllComponents();
    this.saveVideoChanges(updatedVideo, index);
  }


  
  // Método para guardar los cambios en la base de datos
  async saveVideoChanges(video: VideoEntry, index: number) {
    try {
      // Si el video ya tiene un ID, actualizarlo
      if (video.id) {
        await this.indexedDbService.updateVideo(video);
      } else {
        // Si es un video nuevo, añadirlo con un ID
        await this.indexedDbService.addVideo(video);
      }
      console.log('Video guardado correctamente');
    } catch (error) {
      console.error('Error al guardar el video:', error);
    }
  }
  async getMinutesVideo(video: VideoEntry): Promise<number> {
    if (video.videoBlob) {
      return new Promise((resolve) => {
        const videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(video.videoBlob);
        videoElement.preload = 'metadata';

        videoElement.onloadedmetadata = () => {
          console.log('Duración del video:', videoElement.duration);
          URL.revokeObjectURL(videoElement.src);
          resolve(Math.round(videoElement.duration / 60)); 
        };

        videoElement.onerror = () => {
          console.error('Error al cargar el video:', videoElement.error);
          URL.revokeObjectURL(videoElement.src);
          resolve(0); 
        };
      });
    }
    return 1;  
  }
  async uploadVideos(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.progress = 0;
    this.message = 'Iniciando la subida de videos...';
    
    try {
      // Establecer la conexión WebSocket
      const userId = this.auth.getUserId();
      const url = this.auth.getServerUrl();
      const wsUrl = url.replace('http', 'ws') + `/ws/progress/${userId}/`;
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log('WebSocket connection established');
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);          
          this.progress = data.progress || 0;
          this.message = data.message || '';
          
          if (data.status === 'error') {
            this.isError = true;
            this.isWarning = false;
            this.isSuccess = false;
          } else if (data.status === 'warning') {
            this.isError = false; 
            this.isWarning = true;
            this.isSuccess = false;
          } else if (data.progress === 100) {
            this.isError = false;
            this.isWarning = false;
            this.isSuccess = true;
          } else {
            this.isError = false;
            this.isWarning = false;
            this.isSuccess = false;
          }
        } catch (err) {
          console.error('Error recibiendo mensaje de websocket:', err);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isError = true;
        this.message = 'Error en la conexión WebSocket';
      };
      // Rellenar durarción de los videos
      for (const video of this.videos) {
        video.duration = await this.getMinutesVideo(video);
        console.log('Duración del video:', video.duration);
      }
      
      await this.auth.uploadVideos(this.videos,this.isQualityRescaleEnabled);
      
      socket.close();
      
      this.isLoading = false;
      this.indexedDbService.delAll();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Upload error:', error);
      this.isError = true;
      this.message = 'Error durante la subida: ' + (error instanceof Error ? error.message : 'Error desconocido');
      this.isLoading = false;
    }
  }

}