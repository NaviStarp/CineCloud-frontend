import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-media-view',
  imports: [CommonModule,FaIconComponent],
  templateUrl: './media-view.component.html',
  styleUrl: './media-view.component.css'
})
export class MediaViewComponent {
  @Input() thumbnail?: string;
  @Input() title?: string;
  @Input() description?: string;
  @Input() mediaType?: string;
  @Output() see: EventEmitter<void> = new EventEmitter<void>();

  //Iconos
  faPlay = faPlay;
  constructor() { }

  onClick() {
    this.see.emit();
  }

}
