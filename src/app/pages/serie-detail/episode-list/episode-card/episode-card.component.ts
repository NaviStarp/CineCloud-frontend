import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEdit, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService, Episode } from '../../../../services/auth.service';

@Component({
  selector: 'app-episode-card',
  imports: [CommonModule, FaIconComponent],
  templateUrl: './episode-card.component.html',
  styleUrl: './episode-card.component.css',
})
export class EpisodeCardComponent implements OnInit {
    @Input() episode: Episode = {
      id: 0,
      titulo: '',
      temporada: 0,
      numero: 0,
      duracion: 0,
      descripcion: '',
      imagen: '',
      progreso: 0
    } ;
    @Output() episodeSelected: EventEmitter<any> = new EventEmitter<any>();
    @Output() episodeEdit: EventEmitter<any> = new EventEmitter<any>();
    @Output() episodeDelete: EventEmitter<any> = new EventEmitter<any>();
    faTrash = faTrash;
    faEdit = faEdit;
    faPlay = faPlay;
    isHovered: boolean = false;
    constructor(private auth:AuthService) {
    }
    ngOnInit(): void {
      if (this.episode && this.episode.id) {
        this.auth.getEpisodeProgress(this.episode.id.toString()).then((progress) => {
          this.episode.progreso = progress;
        }).catch((error) => {
          this.episode.progreso = 0;
        });
      } else {
        this.episode.progreso = 0;
      }
    }
    selectEpisode(episode: any): void {
      console.log('EPISODIO', episode);
      this.episodeSelected.emit(episode);
    }

  }

