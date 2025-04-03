import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService, MediaResponse } from '../services/auth.service';

@Component({
  selector: 'app-prueba',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prueba.component.html',
  styleUrl: './prueba.component.css'
})
export class PruebaComponent implements OnInit {
  videos: MediaResponse | null = null;
  
  constructor(private auth: AuthService) {}
  
  ngOnInit(): void {
    this.loadVideos();
  }
  
  async loadVideos() {
    try {
      this.videos = await this.auth.getVideos();
      
      console.log('Videos:', this.videos);

      if (this.videos && this.videos.peliculas) {
        const peliculas = [...this.videos.peliculas];
        const episodios = [...this.videos.episodios];
        const series = [...this.videos.series];
      
        for (let i = 0; i < peliculas.length; i++) {
          const pelicula = peliculas[i];
          pelicula.videoBlob = await this.auth.getVideoUrl(pelicula.video);
          pelicula.thumbnail = await this.auth.getThumnailUrl(pelicula.imagen);
        }
      
        for(let i = 0; i<episodios.length; i++){
          const episodio = this.videos.episodios[i];
          episodio.videoBlob = await this.auth.getVideoUrl(episodio.video);
          episodio.thumbnail = await this.auth.getThumnailUrl(episodio.imagen);
        }
      
        for(let i = 0; i<series.length; i++){
          const serie = this.videos.series[i];
          serie.thumbnail = await this.auth.getThumnailUrl(serie.imagen);
        }
      
      }
    } catch (error) {
      
      console.error('Error loading videos:', error);
   
    }
  }
}