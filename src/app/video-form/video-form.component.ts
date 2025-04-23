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
  categories = [''];
  videoUrl :string | null = null;

  // Font Awesome icons
  faPlay = faPlay;
  faEdit = faEdit;
  faTimes = faTimes;
  faPlus = faPlus;
  faFilm = faFilm;
  
  seriesList: Series[] = []; // Lista de series disponibles
  isCreatingNewSeries = false;
  newSeries = { name: '', description: '' ,releaseDate: new Date(),category: ''};

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
  async loadCategories() {
    try {
      const categories = await this.auth.getCategories();
      this.categories = categories.map((category: any) => category.name);
    }
    catch (error) {
      console.error('Error al cargar las categorías:', error);
    }
  }

  async loadSeries() {
    try {
      const series = await this.auth.getSeries();
      this.seriesList = series.map((serie: any) => ({
        ...serie,
        episodios: serie.episodios.map((episodio: any) => ({
          ...episodio,
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
      videoBlob: new File([], ''),
      description: '',
      videoMime: '',
      video: null,
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

  async playVideo(event: Event) {
    event.stopPropagation();
    await this.loadVideo();

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
    
    const selectedSeriesId = Number(event.target.value);
    const selectedSeries = this.seriesList.find(serie => Number(serie.id) === selectedSeriesId);
    
    if (selectedSeries) {
      this.video.seriesId = selectedSeries.id;
      this.video.seriesName = selectedSeries.titulo;
      this.video.seriesDescription = selectedSeries.descripcion;
      this.video.seriesReleaseDate = new Date(selectedSeries.fecha_estreno);
      
      // Auto-completar temporada y capítulo
      this.autoFillSeasonAndChapter(selectedSeries);
    }
  }
  
  autoFillSeasonAndChapter(series: Series) {
    if (!series.episodios || series.episodios.length === 0) {
      // Si no hay episodios, comenzar con temporada 1, capítulo 1
      this.video.season = 1;
      this.video.chapter = 1;
      return;
    }
    
    // Encontrar la última temporada
    const maxSeason = Math.max(...series.episodios.map(ep => ep.temporada || 0));
    
    // Encontrar el último capítulo de la última temporada
    const episodesInLastSeason = series.episodios.filter(ep => ep.temporada === maxSeason);
    let maxChapter = 0;
    
    if (episodesInLastSeason.length > 0) {
      maxChapter = Math.max(...episodesInLastSeason.map(ep => ep.numero || 0));
    }
    
    // Sugerir el siguiente capítulo en la misma temporada
    this.video.season = maxSeason;
    this.video.chapter = maxChapter + 1;
  }

  openCreateSeriesModal() {
    this.isCreatingNewSeries = true;
    this.newSeries = { name: '', description: '' ,releaseDate: new Date(),category: ''};
  }

  cancelCreateSeries() {
    this.isCreatingNewSeries = false;
    if (this.video.seriesId === 0) {
      this.video.seriesId = null;
    }
  }

async saveNewSeries() {
  const newSeriesId = Date.now();
  const createdSeries: Series = {
    id: newSeriesId,
    titulo: this.newSeries.name,
    descripcion: this.newSeries.description,
    temporadas: 1,
    imagen: this.video.thumbnail, // Coje la imagen del video
    fecha_estreno: this.newSeries.releaseDate.toString(),
    episodios: []
  };

  // Guardar la serie en el servicio AuthService
  await this.auth.createSeries(createdSeries);
  
  // Actualizar la lista local de series
  this.seriesList.push(createdSeries);

  this.video.seriesId = newSeriesId;
  this.video.seriesName = this.newSeries.name;
  this.video.seriesDescription = this.newSeries.description;
  this.video.seriesReleaseDate = this.newSeries.releaseDate;
  
  // Si este es el primer episodio de la primera temporada
  this.video.season = 1;
  this.video.chapter = 1;

  this.isCreatingNewSeries = false;
  this.videoChange.emit(this.video);

}
}
