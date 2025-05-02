import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-media-card',
  imports: [CommonModule],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.css'
})
export class MediaCardComponent {
  @Input() thumbnail: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() type: string = '';
  @Input() date: string = '';
}
