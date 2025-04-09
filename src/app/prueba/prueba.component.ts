import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Hls from 'hls.js';
import { VideoPlayerComponent } from "../general/video-player/video-player.component";

@Component({
  selector: 'app-prueba',
  standalone: true,
  imports: [CommonModule, FormsModule, VideoPlayerComponent],
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent {
}