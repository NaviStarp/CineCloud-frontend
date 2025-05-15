import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEdit, faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-episode-card',
  imports: [CommonModule, FaIconComponent],
  templateUrl: './episode-card.component.html',
  styleUrl: './episode-card.component.css',
})
export class EpisodeCardComponent implements OnInit {
    @Input() episode: any;
    @Output() episodeSelected: EventEmitter<any> = new EventEmitter<any>();
    @Output() episodeEdit: EventEmitter<any> = new EventEmitter<any>();
    @Output() episodeDelete: EventEmitter<any> = new EventEmitter<any>();
    faTrash = faTrash;
    faEdit = faEdit;
    faPlay = faPlay;
    isHovered: boolean = false;
    progress: number = 0;
    constructor(private auth:AuthService) {
    }
    ngOnInit(): void {
      if (this.episode && this.episode.id) {
        this.auth.getEpisodeProgress(this.episode.id).then((progress) => {
          this.progress = progress ?? 0;
          console.log('PROGRESO:', this.progress);
        }).catch((error) => {
          this.progress = 0;
        });
      } else {
        this.progress = 0;
      }
    }
    selectEpisode(episode: any): void {
      console.log('EPISODIO', episode);
      this.episodeSelected.emit(episode);
    }

  }

