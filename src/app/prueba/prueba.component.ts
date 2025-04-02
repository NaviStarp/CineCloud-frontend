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
      // Get data from server and wait for it to resolve
      this.videos = await this.auth.getVideos();
      console.log('Videos:', this.videos);
      // Now that videos is populated, we can process the movies
      if (this.videos && this.videos.peliculas) {
        // Create a copy of the array to avoid modification issues
        const peliculas = [...this.videos.peliculas];
        
        // Process each movie one by one
        for (let i = 0; i < peliculas.length; i++) {
          const pelicula = peliculas[i];
          pelicula.videoBlob = await this.auth.getVideoUrl(pelicula.video);
          pelicula.thumbnail = await this.auth.getThumnailUrl(pelicula.imagen);
        }
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  }
}