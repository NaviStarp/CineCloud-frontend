import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from "../general/header/header.component";
import { MediaCardComponent } from "../media-gallery/media-card/media-card.component";
import { LoadingComponent } from "../general/loading/loading.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-media-filter',
  imports: [HeaderComponent, MediaCardComponent, LoadingComponent,CommonModule],
  templateUrl: './media-filter.component.html',
  styleUrl: './media-filter.component.css'
})
export class MediaFilterComponent {
  constructor(private route:ActivatedRoute,private auth:AuthService) { }
  media:any[] = [];
  mediaType: string = '';
  isLoading: boolean = true;
  async ngOnInit() {
    this.mediaType = this.route.snapshot.data['type'];
    await this.getMedia();
    console.log(this.media);
    console.log(this.mediaType);
    this.isLoading = false;
  }

  async getMedia() {
    // Lógica para obtener los medios según el tipo
    if (this.mediaType === 'movies') {
      // Obtener películas
      this.media = await this.auth.getMovies()
      for(let i = 0; i < this.media.length; i++){
        this.media[i].type = 'pelicula';
      }
    } else if (this.mediaType === 'series') {
      // Obtener series
      this.media = await this.auth.getSeries()
      for(let i = 0; i < this.media.length; i++){
        this.media[i].type = 'serie';
        console.log(this.media[i]);
      }
    }
  }


  

}
