import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faPlay } from '@fortawesome/free-solid-svg-icons';
import { EpisodeCardComponent } from "./episode-card/episode-card.component";

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent, EpisodeCardComponent],
  templateUrl: './episode-list.component.html',
  styleUrl: './episode-list.component.css'
})
export class EpisodeListComponent implements OnInit {
  @Input() seasons: number = 0;
  @Input() episodes: any[] = [];
  @Output() episodeSelected: EventEmitter<any> = new EventEmitter<any>();

  filteredEpisodes: any[] = [];
  selectedSeason: number = 1;
  groupedEpisodes: { key: number, values: any[] }[] = [];
  
  // Iconos
  faPlay = faPlay;
  faChevronDown = faChevronDown;

  ngOnInit(): void {
    this.groupEpisodesBySeason();
    if (this.groupedEpisodes.length > 0) {
      this.selectedSeason = this.groupedEpisodes[0].key;
    }
    this.filteredEpisodes = this.getEpisodesBySeason(this.selectedSeason);
  }

  groupEpisodesBySeason(): void {
    this.groupedEpisodes = [];
    if (!this.episodes || this.episodes.length === 0) {
      console.warn('No episodes to group');
      return;
    }

    const seasonMap = new Map<number, any[]>();
    this.episodes.forEach(episode => {
      const seasonNum = episode.temporada || episode.season || 1;
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
      const aNum = a.numero || a.number || 0;
      const bNum = b.numero || b.number || 0;
      return aNum - bNum;
    });
  }

  getEpisodesBySeason(season: number): any[] {
    console.log(this.groupedEpisodes);
    const seasonGroup = this.groupedEpisodes.find(group => group.key === Number(season));
    console.log('Season group:', seasonGroup);
    return seasonGroup ? seasonGroup.values : [];
  }

  onSeasonChange(season: number): void {
    this.selectedSeason = season;
    console.log('Selected season:', this.selectedSeason);
    this.filteredEpisodes = this.getEpisodesBySeason(this.selectedSeason);
    console.log('Filtered episodes:', this.filteredEpisodes);
  }

  selectEpisode(episode: any): void {
    this.episodeSelected.emit(episode);
  }
}