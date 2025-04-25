import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { faPlay, faEdit, faTimes, faFilm, faPlus, faSearch, faTv } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IndexedDbService, VideoEntry } from '../services/indexed-db.service';
import { AuthService, Series } from '../services/auth.service';
import { VideoFormComponent } from './video-form/video-form.component';
import { SerieFormComponent } from "./serie-form/serie-form.component";

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, VideoFormComponent, SerieFormComponent],
  animations: [
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateY(-20px)',
        opacity: 0
      })),
      transition('void <=> *', [
        animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ]),
  ]
})
export class VideoCardComponent implements OnInit {
  @Input() video!: VideoEntry;
  @Output() videoChange = new EventEmitter<VideoEntry>();
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  
  // Estados
  isVideoPlaying = false;
  isEditing = false;
  isCreatingNewSeries = false;
  actualizar = { value: false };
  
  // Video URL
  videoUrl: string | null = null;
  
  // Iconos
  faPlay = faPlay;
  faEdit = faEdit;
  faTimes = faTimes;
  faFilm = faFilm;
  
  constructor(private indexedDbService: IndexedDbService, private auth: AuthService) {}
  
  ngOnInit(): void {
    // Ensure categories is initialized
    if (!this.video.categories || !Array.isArray(this.video.categories)) {
      this.video.categories = [];
    }
  }
  
  // Cargar video desde IndexedDB
  async loadVideo() {
    try {
      console.log("Loading video:", this.video);
      this.videoUrl = await this.indexedDbService.getVideo(this.video.id);
      if (this.videoUrl) {
        console.log("Video URL generated:", this.videoUrl);
      } else {
        console.error("Failed to get video URL for ID:", this.video.id);
      }
    } catch (error) {
      console.error("Error loading video:", error);
    }
  }
  onUpdate() {
    this.actualizar = { value: true }; 
  }
  
  // Funcion que alterna la edición del video
  toggleEdit(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.video.mediaType) {
      this.video.mediaType = 'Pelicula';
    }
    this.isEditing = !this.isEditing;
  }
  
  // Función para reproducir el video
  async playVideo(event: Event) {
    event.stopPropagation();
    await this.loadVideo();
    setTimeout(() => {
      this.isVideoPlaying = true;
    }, 100);
  }
  
  // Función para cerrar el video
  closeVideo(event: Event) {
    event.stopPropagation();
    this.isVideoPlaying = false;
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
    }
  }
  
  // Handle video change from the form component
  onVideoFormChange(updatedVideo: VideoEntry) {
    this.video = updatedVideo;
    this.videoChange.emit(this.video);
    this.isEditing = false;
  }
}