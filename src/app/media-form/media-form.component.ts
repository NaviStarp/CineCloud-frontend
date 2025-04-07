import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faFilm, faPlus, faSpinner, faTv } from '@fortawesome/free-solid-svg-icons';
import { IndexedDbService } from '../services/indexed-db.service';
import { VideoFormComponent } from '../video-form/video-form.component';
import { Router } from '@angular/router';
import { VideoEntry } from '../services/indexed-db.service';
import { AuthService, Series } from '../services/auth.service';

@Component({
  selector: 'app-media-form',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    VideoFormComponent
  ],
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.css']
})
export class MediaFormComponent implements OnInit {
  Math = Math;
  faFilm = faFilm;
  faTv = faTv;
  faPlus = faPlus;
  faCheck = faCheck;
  faSpinner = faSpinner;
  isLoading = false;
  videos: VideoEntry[] = [];
  series: Series[] = [];
  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef;
  @ViewChildren('videoItem') videoItems!: QueryList<ElementRef>;

  constructor(private indexedDbService: IndexedDbService, private router: Router,private auth:AuthService) { }

  ngOnInit(): void {
    this.loadVideos();
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
  async uploadVideos(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    await this.auth.uploadVideos(this.videos);
    this.isLoading = false;
    this.indexedDbService.delAll()
    this.router.navigate(['/']);
  }

  addVideos(event: Event) {
    event.preventDefault();
    this.router.navigate(['/']);
  }

  confirrmChanges(event: Event) {
    event.preventDefault();
    
    this.router.navigate(['/']);
  }
}