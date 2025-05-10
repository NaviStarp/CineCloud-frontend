import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-episode-card',
  imports: [CommonModule, FaIconComponent],
  templateUrl: './episode-card.component.html',
  styleUrl: './episode-card.component.css',
})
export class EpisodeCardComponent implements OnInit {
    @Input() episode: any;
    @Output() episodeSelected: EventEmitter<any> = new EventEmitter<any>();
    faPlay = faPlay;
    isHovered: boolean = false;
    progress: number = 0;
    constructor(private auth:AuthService) {
      console.log('EPISODIO',this.episode);
    }
    ngOnInit(): void {
      console.log(this.episode);
     this.auth.getEpisodeProgress(this.episode.id).then((progress) => {
        this.progress = progress;
      });
      console.log(this.progress);
    }
    selectEpisode(episode: any): void {
      console.log('EPISODIO', episode);
      this.episodeSelected.emit(episode);
    }

  }

