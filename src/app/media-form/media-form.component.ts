import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilm, faTv } from '@fortawesome/free-solid-svg-icons';
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
  Math = Math;
  faFilm = faFilm;
  faTv = faTv;
  videos: VideoEntry[] = [];
  selectedVideo!: VideoEntry;
  selectedVideos: VideoEntry[] = [];
  seriesDetails: { name: string; season: number } | null = null;
  selectedVideoIndex = 0;

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
      
      // Select the first video and center it
      if (this.videos.length > 0) {
        this.selectVideo(this.videos[0], 0);
      }
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

  selectVideo(video: VideoEntry, index: number) {
    this.selectedVideo = video;
    this.selectedVideoIndex = index;

    // Wait for view to update
    setTimeout(() => {
      const items = this.videoItems.toArray();
      if (items[index]) {
        // Adjust the transform of all video items to center the selected video
        const translateOffset = -(index - Math.floor(this.videos.length / 2)) * 100;
        
        items.forEach((item, itemIndex) => {
          const videoElement = item.nativeElement;
          videoElement.style.transform = `translateX(${translateOffset + (itemIndex - index) * 100}%)`;
        });

        // Scroll to the selected video
        items[index].nativeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center', 
          inline: 'center' 
        });

        // Adjust window scroll to center the video
        window.scrollTo({
          top: items[index].nativeElement.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (items[index].nativeElement.offsetHeight / 2),
          behavior: 'smooth'
        });
      }
    }, 0);
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

  calcularMovimientos() {
    let movimientos = 0;
    this.selectedVideos.forEach(video => {
      movimientos += video.chapter || 0;
    });
    return movimientos;
  }
}