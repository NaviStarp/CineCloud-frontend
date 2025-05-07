import { CommonModule } from '@angular/common';
import { Component, input, Input, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-media-card',
  imports: [CommonModule,FaIconComponent],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.css'
})
export class MediaCardComponent {
  @Input() thumbnail: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() type: string = '';
  @Input() date: string = '';
  @Input() duration: string = '';
  @Input() seasons:number = 0;
  // Variables
  hover: boolean = false;
  // Iconos
  faPlay = faPlay;

}
