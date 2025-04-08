import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Hls from 'hls.js';

@Component({
  selector: 'app-prueba',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent {
  @Input() videoUrl: string = 'http://localhost:8000/hls/pelicula/Cubo/playlist.m3u8';
  authToken: string =  '';
  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;
  hls!: Hls;
  qualityLevels: { index: number; label: string }[] = [];
  selectedQuality: number = -1; // -1 for "Auto"

  ngAfterViewInit() {
    try {
      this.authToken = localStorage.getItem('token') || '';
    } catch (error) {
    }
    
    const video = this.videoRef.nativeElement;

    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(this.videoUrl);

      // Añadir el token de autorización a la solicitud
      this.hls.config.xhrSetup = (xhr: XMLHttpRequest) => {
        xhr.setRequestHeader('Authorization', `Token ${this.authToken}`);
      };

      this.hls.attachMedia(video);

      // Añadir niveles de calidad
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.qualityLevels = this.hls.levels.map((level, index) => ({
          index,
          label: `${level.height}p`
        }));
        this.qualityLevels.unshift({ index: -1, label: 'Auto' }); // Opcion auto
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Para navegadores que soportan HLS nativamente
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.videoUrl, true);
      xhr.setRequestHeader('Authorization', `Token ${this.authToken}`);
      xhr.responseType = 'blob';

      xhr.onload = () => {
        if (xhr.status === 200) {
          video.src = URL.createObjectURL(xhr.response);
        }
      };

      xhr.send();
    }
  }

  changeQuality(index: number) {
    if (this.hls) {
      this.selectedQuality = index;
      this.hls.currentLevel = index; // -1 para auto
    }
  }
}