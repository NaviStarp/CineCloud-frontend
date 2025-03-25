import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faTimes, faCloudUploadAlt, faFileAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import { ModalErrorComponent } from "../general/modal-error/modal-error.component";
import { IndexedDbService } from '../services/indexed-db.service';

@Component({
  selector: 'app-media-form',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './media-form.component.html',
  styleUrl: './media-form.component.css'
})


export class MediaFormComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  videos: { videoBlob: string; videoType: string,thumbnail:string }[] = [];
  faFileAlt = faFileAlt;
  faTimes = faTimes;

  constructor(private indexedDbService: IndexedDbService) {}

  ngOnInit(): void {
    this.loadVideos();
        
    }
    async loadVideos() {
      try {
      const videos = await this.indexedDbService.getVideos();
      this.videos = await Promise.all(videos.map(async (file: File) => {
        // Creamos una URL para cada video a partir del Blob
        const videoBlob = URL.createObjectURL(file);
        const thumbnail = await this.extractThumbnail(file);
        console.log(thumbnail);
        const videoType = file.type || 'video/mp4'; // Establecemos un valor predeterminado si no hay tipo MIME
    
        return { videoBlob, videoType, thumbnail };
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
    playVideo(video: { videoBlob: string; videoType: string,thumbnail:string }) {
      console.log('Reproduciendo video:', video);
      const videoPlay = this.videoPlayer.nativeElement;
      videoPlay.poster = video.thumbnail;
      videoPlay.classList.remove('hidden');
      videoPlay.src = video.videoBlob;
      videoPlay.play();
    }
}
