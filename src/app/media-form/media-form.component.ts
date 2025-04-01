import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilm, faTv } from '@fortawesome/free-solid-svg-icons';
import { IndexedDbService } from '../services/indexed-db.service';
import { VideoFormComponent } from '../video-form/video-form.component';

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
    FormsModule,
    VideoFormComponent
  ],
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.css']
})
export class MediaFormComponent implements OnInit {
  Math = Math;
  faFilm = faFilm;
  faTv = faTv;
  videos: VideoEntry[] = [];

  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef;
  @ViewChildren('videoItem') videoItems!: QueryList<ElementRef>;

  constructor(private indexedDbService: IndexedDbService) { }

  ngOnInit(): void {
    this.loadVideos();
  }

  async loadVideos() {
    try {
      const files = await this.indexedDbService.getVideos();
      this.videos = await Promise.all(files.map(async (file: File) => {
        const videoBlob = URL.createObjectURL(file);
        const thumbnail = await this.extractThumbnail(file);
        const videoType = file.type || 'video/mp4';
        return { videoBlob, videoType, thumbnail, name: file.name };
      }));
    } catch (error) {
      console.error('Error al cargar los videos:', error);
    }
  }

  extractThumbnail(videoBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoBlob);
      video.onloadeddata = () => {
        video.currentTime = 1; // mover el video a los 5 segundos
      };

      video.ontimeupdate = () => {
        if (video.currentTime >= 1) {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL());
          video.ontimeupdate = null; // Parar la ejecución del evento
        }
      };
      video.onerror = (error) => {
        reject(error);
      };
    });
  }

}