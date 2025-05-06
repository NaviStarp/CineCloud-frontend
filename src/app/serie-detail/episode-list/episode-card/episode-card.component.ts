import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-episode-card',
  imports: [CommonModule, FaIconComponent],
  templateUrl: './episode-card.component.html',
  styleUrl: './episode-card.component.css',
})
export class EpisodeCardComponent {
    @Input() episode: any;
    @Output() episodeSelected: EventEmitter<any> = new EventEmitter<any>();
    faPlay = faPlay;
    isHovered: boolean = false;
    selectEpisode(episode: any): void {
      this.episodeSelected.emit(episode);
    }
  }

