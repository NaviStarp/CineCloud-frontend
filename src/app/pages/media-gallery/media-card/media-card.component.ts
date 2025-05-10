import { CommonModule } from '@angular/common';
import { Component, Inject, input, Input, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-media-card',
  imports: [CommonModule,FaIconComponent],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.css'
})
export class MediaCardComponent implements OnInit {
  @Input() thumbnail: string = '';
  @Input() id: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() type: string = '';
  @Input() date: string = '';
  @Input() duration: string = '';
  @Input() seasons:number = 0;
  progress: number = 0; 
  // Variables
  hover: boolean = false;
  // Iconos
  faPlay = faPlay;
  constructor(private auth:AuthService) { }

  async ngOnInit(): Promise<void> {
    console.log(this.type)
    if(this.id == undefined || this.id == null || this.id == '')
      return;
    if(this.type == 'pelicula'){
      this.progress = await this.auth.getMovieProgress(this.id);
    }
    if(this.progress == null || this.progress == undefined)
      this.progress = 0;
  }
}

