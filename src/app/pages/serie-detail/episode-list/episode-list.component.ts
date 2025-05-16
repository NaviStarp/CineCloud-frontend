import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faPlay } from '@fortawesome/free-solid-svg-icons';
import { EpisodeCardComponent } from "./episode-card/episode-card.component";
import { Episode } from '../../../services/auth.service';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent, EpisodeCardComponent],
  templateUrl: './episode-list.component.html',
  styleUrl: './episode-list.component.css'
})
export class EpisodeListComponent implements OnInit, OnChanges {
  @Input() seasons: number = 0;
  @Input() episodes: Episode[] = [];
  @Input() selectedSeason: number = 1;
  @Output() episodeSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() episodeEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() episodeDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() seasonChanged: EventEmitter<number> = new EventEmitter<number>();
  @ViewChildren(EpisodeCardComponent) episodeCards!: QueryList<EpisodeCardComponent>;
  filteredEpisodes: Episode[] = [];
  groupedEpisodes: { key: number, values: any[] }[] = [];
  
  // Iconos
  faPlay = faPlay;
  faChevronDown = faChevronDown;

  ngOnInit(): void {
    this.groupEpisodesBySeason();
    if (this.groupedEpisodes.length > 0 && !this.selectedSeason) {
      this.selectedSeason = this.groupedEpisodes[0].key;
      this.seasonChanged.emit(this.selectedSeason);
    }
    this.filteredEpisodes = this.getEpisodesBySeason(this.selectedSeason);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['episodes'] && !changes['episodes'].firstChange) {
      this.groupEpisodesBySeason();
      this.filteredEpisodes = this.getEpisodesBySeason(this.selectedSeason);
    }
    
    if (changes['selectedSeason'] && !changes['selectedSeason'].firstChange) {
      this.filteredEpisodes = this.getEpisodesBySeason(this.selectedSeason);
    }
  }

  refreshProgress(): void {
    console.log('Refreshing progress');
    console.log(this.episodeCards)
    if (this.episodeCards && typeof this.episodeCards.forEach === 'function') {
      this.episodeCards.forEach((card) => {
        if (card.episode && card.episode.id) {
          card.ngOnInit();
        }
      });
    } else {
      console.warn('episodeCards is not available or not iterable');
    }
  }

  groupEpisodesBySeason(): void {
    this.groupedEpisodes = [];
    if (!this.episodes || this.episodes.length === 0) {
      console.warn('No episodes to group');
      return;
    }

    const seasonMap = new Map<number, any[]>();
    this.episodes.forEach(episode => {
      const seasonNum = episode.temporada || 1;
      if (!seasonMap.has(seasonNum)) {
        seasonMap.set(seasonNum, []);
      }
      seasonMap.get(seasonNum)?.push(episode);
    });

    seasonMap.forEach((episodes, season) => {
      this.groupedEpisodes.push({
        key: season,
        values: this.sortEpisodesByNumber(episodes)
      });
    });
    
    this.groupedEpisodes.sort((a, b) => a.key - b.key);
  }

  sortEpisodesByNumber(episodes: any[]): any[] {
    return episodes.sort((a, b) => {
      const aNum = a.numero || a.number || a.episode || 0;
      const bNum = b.numero || b.number || b.episode || 0;
      return aNum - bNum;
    });
  }

  getEpisodesBySeason(season: number): any[] {
    const seasonGroup = this.groupedEpisodes.find(group => group.key === Number(season));
    return seasonGroup ? seasonGroup.values : [];
  }

  onSeasonChange(season: number): void {
    this.selectedSeason = Number(season);
    this.filteredEpisodes = this.getEpisodesBySeason(this.selectedSeason);
    this.seasonChanged.emit(this.selectedSeason);
  }

  selectEpisode(episode: any): void {
    this.episodeSelected.emit(episode);
  }
}
