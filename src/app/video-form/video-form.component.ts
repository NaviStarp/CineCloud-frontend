// video-form.component.ts
import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { faPlay, faEdit, faTimes, faFilm, faPlus } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IndexedDbService, VideoEntry } from '../services/indexed-db.service';
import { AuthService, Series } from '../services/auth.service';

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
export class VideoFormComponent implements OnInit {
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
  
  seriesList: Series[] = []; // Lista de series disponibles
  isCreatingNewSeries = false;
  newSeries = { name: '', description: '' ,releaseDate: new Date()};

  constructor(private indexedDbService: IndexedDbService,private auth: AuthService) {
    // Inicializar el video si no se proporciona
    this.video = this.video || this.createEmptyVideoEntry();
  }

  ngOnInit(): void {
    this.loadSeries();
  }
  ngOnDestroy() {
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
    }
  }

  async loadSeries() {
    try {
      const series = await this.auth.getSeries();
      this.seriesList = series.map((serie: any) => ({
        ...serie,
        episodios: serie.episodios.map((episodio: any) => ({
          ...episodio,
          thumbnail: this.auth.getThumnailUrl(episodio.imagen)
        }))
      }));
    } catch (error) {
      console.error('Error al cargar las series:', error);
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
      seriesDescription: '',
      seriesReleaseDate: new Date(),
    };
  }
  saveChanges($event: Event) {
    $event.stopPropagation();
    console.log('Saving changes:', this.video);
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
      return;
    }
    console.log('Selected series ID:', event.target.value);
    console.log('Selected series:', this.seriesList);
    for (const serie of this.seriesList) {
      if (Number(serie.id) === Number(event.target.value)) {
        console.log('Selected series:', serie);
        console.log('Selected series ID:', serie.id);
        console.log('Selected series name:', serie.titulo);
        this.video.seriesId = serie.id;
        this.video.seriesName = serie.titulo;
        this.video.seriesDescription = serie.descripcion;
        this.video.seriesReleaseDate = new Date(serie.fecha_estreno);
      }
    }
  }

  openCreateSeriesModal() {
    this.isCreatingNewSeries = true;
    this.newSeries = { name: '', description: '' ,releaseDate: new Date()};
  }

  cancelCreateSeries() {
    this.isCreatingNewSeries = false;
    if (this.video.seriesId === 0) {
      this.video.seriesId = null;
    }
  }

  saveNewSeries() {
    const newSeriesId = Date.now();
    const createdSeries: Series = {
      id: newSeriesId,
      titulo: this.newSeries.name,
      descripcion: this.newSeries.description,
      temporadas: 1,
      imagen: '',
      fecha_estreno: this.newSeries.releaseDate.toString(),
      episodios: []
    };

    this.seriesList.push(createdSeries);

    this.video.seriesId = newSeriesId; // Assigning numeric ID
    this.video.seriesName = this.newSeries.name;
    this.video.seriesDescription = this.newSeries.description;
    this.video.seriesReleaseDate = this.newSeries.releaseDate;

    this.isCreatingNewSeries = false;
  }
}
