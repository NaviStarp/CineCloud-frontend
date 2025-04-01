// video-card.component.ts
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { faPlay, faEdit, faTimes, faFilm, faPlus } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-video-form',
  templateUrl: './video-form.component.html',
  styleUrls: ['./video-form.component.css'],
  imports: [CommonModule,FormsModule,FontAwesomeModule],
  animations: [
    trigger('slideInOut', [
        state('void', style({
          transform: 'translateY(-20px)',
          opacity: 0
        })),
        transition('void <=> *', [
          animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)')
        ])
      ])
      ,
  ]
})
export class VideoFormComponent {
  @Input() video: any;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  
  isVideoPlaying = false;
  isEditing = false;
  
  // Font Awesome icons
  faPlay = faPlay;
  faEdit = faEdit;
  faTimes = faTimes;
  faPlus = faPlus;
  faFilm = faFilm;

  seriesList: any[] = []; // Lista de series disponibles
  isCreatingNewSeries = false;
  newSeries = { name: '', description: '' };
  
  toggleEdit(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isEditing = !this.isEditing;
  }
  
  playVideo(event: Event) {
    event.stopPropagation();
    this.isVideoPlaying = !this.isVideoPlaying;
  }
  
  closeVideo(event: Event) {
    event.stopPropagation();
    this.isVideoPlaying = false;
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
    }
  }
  
  saveChanges(event: Event) {
    event.preventDefault();
    // Add your save logic here
    
    this.isEditing = false;
  }

// Métodos a implementar
setVideoType(type: string) {
  this.video.type = type;
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
  // Si se había seleccionado "Crear nueva serie" en el dropdown, resetear
  if (this.video.seriesId === 'new') {
    this.video.seriesId = null;
  }
}

saveNewSeries() {
  // Aquí iría la lógica para guardar la nueva serie en tu backend
  // y obtener un ID para ella
  
  // Simulación:
  const newSeriesId = 'series_' + Date.now();
  const createdSeries = {
    id: newSeriesId,
    name: this.newSeries.name,
    description: this.newSeries.description
  };
  
  // Añadir a la lista local
  this.seriesList.push(createdSeries);
  
  // Seleccionar la serie recién creada
  this.video.seriesId = newSeriesId;
  this.video.seriesName = this.newSeries.name;
  
  // Cerrar el modal
  this.isCreatingNewSeries = false;
}
}