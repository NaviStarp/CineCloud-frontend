// video-form.component.ts
import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { faPlay, faEdit, faTimes, faFilm, faPlus } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IndexedDbService, VideoEntry } from '../services/indexed-db.service';

@Component({
  selector: 'app-video-form',
  templateUrl: './video-form.component.html',
  styleUrls: ['./video-form.component.css'],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
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
export class VideoFormComponent {
  @Input() video!: VideoEntry;
  @Output() videoChange = new EventEmitter<VideoEntry>();
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  isVideoPlaying = false;
  isEditing = false;

  videoUrl :string | null = null;

  // Font Awesome icons
  faPlay = faPlay;
  faEdit = faEdit;
  faTimes = faTimes;
  faPlus = faPlus;
  faFilm = faFilm;

  seriesList: any[] = []; // Lista de series disponibles
  isCreatingNewSeries = false;
  newSeries = { name: '', description: '' };

  constructor(private indexedDbService: IndexedDbService) {
    // Inicializar el video si no se proporciona
    this.video = this.video || this.createEmptyVideoEntry();
  }
  ngOnDestroy() {
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
    }
  }

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
  private createEmptyVideoEntry(): VideoEntry {
    return {
      id: '',
      videoBlob: new ArrayBuffer(0),
      description: '',
      videoMime: '',
      name: '',
      thumbnail: '',
      mediaType: 'Pelicula',
      releaseDate: new Date(),
      seriesId: null,
      season: null,
      chapter: null,
      seriesName: '',
      seriesDescription: ''
    };
  }
  saveChanges($event: Event) {
    $event.stopPropagation();
    this.videoChange.emit(this.video);
    this.isEditing = false;
  }

  toggleEdit(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.video.mediaType) {
      this.video.mediaType = 'Pelicula';
    }
    this.isEditing = !this.isEditing;
  }

  playVideo(event: Event) {
    event.stopPropagation();
    this.loadVideo();
    setTimeout(() => {
    this.isVideoPlaying = !this.isVideoPlaying;
    }, 100);
  }

  closeVideo(event: Event) {
    event.stopPropagation();
    this.isVideoPlaying = false;
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
    }

    this.video.mediaType = this.video.mediaType || 'Pelicula';
    event.preventDefault();
    this.videoChange.emit(this.video);
    this.isEditing = false;
  }

  setVideoType(type: 'Pelicula' | 'series') {
    this.video.mediaType = type;
  }

  onSeriesChange(event: any) {
    if (event.target.value === 'new') {
      this.openCreateSeriesModal();
    }
  }

  openCreateSeriesModal() {
    this.isCreatingNewSeries = true;
    this.newSeries = { name: '', description: '' };
  }

  cancelCreateSeries() {
    this.isCreatingNewSeries = false;
    if (this.video.seriesId === 'new') {
      this.video.seriesId = null;
    }
  }

  saveNewSeries() {
    const newSeriesId = 'series_' + Date.now();
    const createdSeries = {
      id: newSeriesId,
      name: this.newSeries.name,
      description: this.newSeries.description
    };

    this.seriesList.push(createdSeries);

    this.video.seriesId = newSeriesId;
    this.video.seriesName = this.newSeries.name;

    this.isCreatingNewSeries = false;
  }
}
