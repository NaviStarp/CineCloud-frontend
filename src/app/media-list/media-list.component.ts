import { Component, OnInit } from '@angular/core';
import { AuthService, MediaResponse } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MediaViewComponent } from './media-view/media-view.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalErrorComponent } from "../general/modal-error/modal-error.component";

@Component({
  selector: 'app-media-list',
  imports: [CommonModule, MediaViewComponent, ModalErrorComponent],
  templateUrl: './media-list.component.html',
  styleUrl: './media-list.component.css'
})
export class MediaListComponent implements OnInit {
  videos: MediaResponse | null = null;
  videoUrl: SafeResourceUrl | null = null;
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
    this.loadVideo(media);
  }

  loadVideo(media: any) {
    console.log('Load video:', media);
    if(!media.video) {
      this.auth.getSerieEpisodes(media.id).then((episodes) => {
        if(this.videos) {
        this.videos.episodios = episodes;
        }
        this.toggleSelectEpisode();
        console.log('Episodes:', episodes);
      }).catch((error) => {
        console.error('Error loading episodes:', error);
        this.showErrorModal('Error Loading Episodes', 'An error occurred while loading the episodes. Please try again later.');
      }
      );
      return;
    }
    this.auth.getVideoUrl(media.video).then((url) => {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      console.log('Video Blob:', this.videoUrl);
      console.log('Video URL:', url);
      this.showVideo = true;
    }).catch((error) => {
      console.error('Error loading video:', error);
      this.showErrorModal('Error Loading Video', 'An error occurred while loading the video. Please try again later.');
    });
  }

  loadEpisodeVideo(media: any) {
    this.auth.getVideoUrl(media.video).then((url) => {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      console.log('Episode Video Blob:', this.videoUrl);
      console.log('Episode Video URL:', url);
      this.showVideo = true;
    }
    ).catch((error) => {
      console.error('Error loading episode video:', error);
      this.showErrorModal('Error Loading Episode Video', 'An error occurred while loading the episode video. Please try again later.');
    }
    );
  }
  closeVideo() {
    this.showVideo = false;
    this.videoUrl = null;
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
