import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faTrash, faEdit, faFilm, faTv } from '@fortawesome/free-solid-svg-icons';
import { IndexedDbService } from '../services/indexed-db.service';

interface VideoEntry {
  id?: number;
  videoBlob: string;
  videoType: string;
  thumbnail: string;
  name?: string;
  type?: 'series' | 'movie';
  chapter?: number;
  season?: number;
}

@Component({
  selector: 'app-media-form',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.css']
})
export class MediaFormComponent implements OnInit {
  faFilm = faFilm;
  faTv = faTv;
  videos: VideoEntry[] = [];
  selectedVideo: VideoEntry = this.videos[0];
  selectedVideos: VideoEntry[] = [];
  seriesDetails: { name: string; season: number } | null = null;

  constructor(private indexedDbService: IndexedDbService) { }

  ngOnInit(): void {
    this.loadVideos();
  }

  async loadVideos() {
    try {
      const videos = await this.indexedDbService.getVideos();
      this.videos = await Promise.all(videos.map(async (file: File) => {
        const videoBlob = URL.createObjectURL(file);
        const thumbnail = await this.extractThumbnail(file);
        const videoType = file.type || 'video/mp4';
        return { videoBlob, videoType, thumbnail, name: file.name };
      }));
      
      // Select first video by default if available
      if (this.videos.length > 0) {
        this.selectVideo(this.videos[0]);
      }
    } catch (error) {
      console.error('Error al cargar los videos:', error);
    }
  }

  selectVideo(video: VideoEntry) {
    this.selectedVideo = video;
  }

  extractThumbnail(videoBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoBlob);
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL());
      };
      video.onerror = (error) => {
        reject(error);
      };
    });
  }

  handleTypeSelection(video: VideoEntry, type: 'movie' | 'series'): void {
    if (type === 'movie') {
      video.type = 'movie';
      this.seriesDetails = null;
    } else {
      this.seriesDetails = {
        name: video.name?.split('.')[0] || '',
        season: 1
      };
    }
  }

  handleAddToSeries(): void {
    if (!this.seriesDetails || !this.selectedVideo) return;
    const seriesVideo: VideoEntry = {
      ...this.selectedVideo,
      type: 'series',
      season: this.seriesDetails.season,
      chapter: this.selectedVideos.length + 1,
      name: this.seriesDetails.name
    };
    this.selectedVideos.push(seriesVideo);
    this.seriesDetails = null;
  }
}