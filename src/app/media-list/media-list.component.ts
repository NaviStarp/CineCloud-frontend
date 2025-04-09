import { Component, OnInit } from '@angular/core';
import { AuthService, MediaResponse } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MediaViewComponent } from './media-view/media-view.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalErrorComponent } from "../general/modal-error/modal-error.component";
import { VideoPlayerComponent } from "../general/video-player/video-player.component";

@Component({
  selector: 'app-media-list',
  imports: [CommonModule, MediaViewComponent, ModalErrorComponent, VideoPlayerComponent],
  templateUrl: './media-list.component.html',
  styleUrl: './media-list.component.css'
})
export class MediaListComponent implements OnInit {
  videos: MediaResponse | null = null;
  videoUrl: string  = '';
  showVideo: boolean = false;
  showSelectEpisode: boolean = false;
  // Error handling properties
  errorTitle: string = '';
  errorMessage: string = '';
  showError: boolean = false;

  constructor(private auth: AuthService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadVideos();
  }

  async loadVideos() {
    try {
      this.videos = await this.auth.getVideos();

      console.log('Videos:', this.videos);

      if (this.videos && this.videos.peliculas) {
        const peliculas = [...this.videos.peliculas];
        const series = [...this.videos.series];

        for (let i = 0; i < peliculas.length; i++) {
          const pelicula = peliculas[i];
          pelicula.thumbnail = await this.auth.getThumnailUrl(pelicula.imagen);
        }

        for (let i = 0; i < series.length; i++) {
          const serie = this.videos.series[i];
          serie.thumbnail = await this.auth.getThumnailUrl(serie.imagen);
        }
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      this.showErrorModal('Error Loading Videos', 'An error occurred while loading the videos. Please try again later.');
    }
  }

  onSee(media: any) {
    console.log('Media clicked:', media);
    this.videoUrl = this.auth.getHLSUrl(media.video);
    console.log('Video URL:', this.videoUrl);
  }

  closeVideo() {
    this.showVideo = false;
    this.videoUrl = '';
  }

  toggleSelectEpisode() {
    this.showSelectEpisode = !this.showSelectEpisode;
  }
  // Error modal logic
  showErrorModal(title: string, message: string) {
    console.log('Show error modal:', title, message);
    this.errorTitle = title;
    this.errorMessage = message;
    this.showVideo = false;
    this.showError = true;
  }

  onCloseError() {
    this.showError = false;
  }
}
