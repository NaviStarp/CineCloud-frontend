import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faTimes, faImage, faCheck, faUpload, 
  faInfoCircle, faSpinner 
} from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService, Episode } from '../../services/auth.service';

@Component({
  selector: 'app-episode-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './episode-edit-modal.component.html',
  styleUrl: './episode-edit-modal.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'scale(0.9)', opacity: 0 }))
      ])
    ])
  ]
})
export class EpisodeEditModalComponent {
  // Icons
  faTimes = faTimes;
  faImage = faImage;
  faCheck = faCheck;
  faUpload = faUpload;
  faInfoCircle = faInfoCircle;
  faSpinner = faSpinner;

  // Input/Output properties
  @Input() episode: Episode = {
    id: 0,
    titulo: '',
    descripcion: '',
    imagen: '',
    temporada: 1,
    duracion: 0,
    progreso: 0,
    numero: 1
  };
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Episode>();
  
  // Component properties
  imageUrl: string = '';
  isSubmitting: boolean = false;
  constructor(private auth:AuthService) {}
  ngOnInit() {
    // Initialize imageUrl with the episode's image if it exists
    this.imageUrl = this.episode.imagen || '';
  }
  
  /**
   * Handles form submission
   */
  onSubmit() {
    if (!this.episode.titulo) {
      // Show validation error or alert
      return;
    }
    
    this.isSubmitting = true;
    
    // Update the episode with the latest values
    const updatedEpisode: Episode = {
      ...this.episode,
      titulo: this.episode.titulo,
      descripcion: this.episode.descripcion,
      imagen: this.episode.imagen,
      temporada: this.episode.temporada,
      numero: this.episode.numero
    };
    this.auth.editEpisode(updatedEpisode).then(
      response => {
        console.log('Episode updated successfully:', response);
        this.isSubmitting = false;
        this.close.emit();  
      }
    ).catch(
      error => {
        console.error('Error updating episode:', error);    
        this.isSubmitting = false;
      }
    );
  }
  
  /**
   * Handles file selection for episode image
   */
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.episode.imagen = this.imageUrl;
      };
      reader.readAsDataURL(file);
    }
  }
  
  /**
   * Loads image from URL
   */
  loadFromUrl() {
    if (this.imageUrl) {
      this.episode.imagen = this.imageUrl;
    }
  }
  
  /**
   * Removes the episode image
   */
  removeImage() {
    this.imageUrl = '';
    this.episode.imagen = '';
  }
}
