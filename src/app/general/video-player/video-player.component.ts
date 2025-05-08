import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, PLATFORM_ID, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBackward, faChevronDown, faCog, faCompress, faExpand, faForward, faPause, faPlay, faRedo, faTimes, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import Hls from 'hls.js';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() videoUrl: string = 'http://localhost:8000/hls/pelicula/Cubo/playlist.m3u8';
  @Input() videoTitle: string = '';
  @Input() episodeInfo: string = '';
  @Output() videoClosed = new EventEmitter<void>();

  // Iconos
  faExpand = faExpand;
  faCompress = faCompress;
  faPause = faPause;
  faPlay = faPlay;
  faBackward = faBackward;
  faForward = faForward;
  faVolumeUp = faVolumeUp;
  faVolumeMute = faVolumeMute;
  faCog = faCog;
  faRedo = faRedo;
  faTimes= faTimes;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoUrl'] && !changes['videoUrl'].firstChange) {
      this.reloadVideo();
    }
  }
  reloadVideo() {
    const video = this.videoRef.nativeElement;
    console.log("Recargando video:", this.videoUrl);
    // Pausar y limpiar fuente actual
    video.pause();
    video.removeAttribute('src');
    video.load();
  
    // Destruir instancia HLS anterior si existe
    if (this.hls) {
      this.hls.destroy();
    }
  
    // Volver a inicializar el video
    if (Hls.isSupported()) {
      this.initializeHls(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      this.initializeNativeHls(video);
    }
    video.play();
  }
    

  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  hls!: Hls;
  authToken: string = '';
  qualityLevels: { index: number; label: string }[] = [];
  selectedQuality: number = -1; // -1 for "Auto"
  
  isPlaying: boolean = false;
  isMuted: boolean = false;
  isFullscreen: boolean = false;
  showControls: boolean = true;
  controlsTimeout: any;
  
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;
  bufferPercent: number = 0;
  
  subtitlesEnabled: boolean = false;
  showQualityMenu: boolean = false;
  showVolumeSlider: boolean = false;
  
  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    console.log(this.videoTitle, this.episodeInfo);
    if(this.isBrowser()) {
    try {
      this.authToken = localStorage.getItem('token') || '';
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    } 
  }
  }


  setup():void{
    if (!this.isBrowser()) {
      return;
    }
    const video = this.videoRef.nativeElement;

    // Ensure volume is set and not muted
    video.volume = this.volume;
    video.muted = false;
    video.autoplay = true;
    // Set up event listeners
    video.addEventListener('timeupdate', this.updateProgress.bind(this));
    video.addEventListener('loadedmetadata', this.initializeVideo.bind(this));
    video.addEventListener('play', () => this.isPlaying = true);
    video.addEventListener('pause', () => this.isPlaying = false);
    video.addEventListener('progress', this.updateBuffer.bind(this));
    
    // Initialize HLS
    if (Hls.isSupported()) {
      this.initializeHls(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      this.initializeNativeHls(video);
    }
    
    // Hide controls when mouse is inactive
    document.addEventListener('mousemove', this.showControlsTemporarily.bind(this));
  }
  ngAfterViewInit() {
    this.setup();
    }
  
  initializeHls(video: HTMLVideoElement) {
    this.hls = new Hls({
      xhrSetup: (xhr: XMLHttpRequest) => {
        xhr.setRequestHeader('Authorization', `Token ${this.authToken}`);
      },
    });
    

    this.hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS error:', data);
      if (data.fatal) {
        switch(data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.log('Error de red, intentando recuperar...');
            this.hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log('Error de medio, intentando recuperar...');
            this.hls.recoverMediaError();
            break;
          default:
            console.log('Error fatal, no se puede recuperar');
            this.hls.destroy();
            break;
        }
      }
    });
    
    console.log("Cargando URL:", this.videoUrl);
    
    this.hls.loadSource(this.videoUrl);
    this.hls.attachMedia(video);
    
    this.hls.on(Hls.Events.MANIFEST_PARSED, (event,data) => {
      this.qualityLevels = this.hls.levels.map((level, index) => ({
        index,
        label: `${level.height}p`
      }));
      
      // Sort quality levels in descending order
      this.qualityLevels.sort((a, b) => {
        const heightA = parseInt(a.label);
        const heightB = parseInt(b.label);
        return heightB - heightA;
      });
      
      // Add "Auto" option at the top
      this.qualityLevels.unshift({ index: -1, label: 'Auto' });
    });
  }
  
  initializeNativeHls(video: HTMLVideoElement) {
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
  
  initializeVideo() {
    const video = this.videoRef.nativeElement;
    this.duration = video.duration;
  }
  
  togglePlay() {
    const video = this.videoRef.nativeElement;
    if (video.paused) {
      video.play();
      console.log('Volumen:', video.volume);
      console.log('Mute:', video.muted);
      console.log(this.isMuted, this.volume);
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }
  
  toggleMute() {
    const video = this.videoRef.nativeElement;
    video.muted = !video.muted;
    this.isMuted = video.muted;
    if (this.isMuted) {
      this.volume = 0;
    } else {
      this.volume = video.volume;
    }
  }
  
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      const container = document.querySelector('.video-container') as HTMLElement;
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullscreen = false;
    }
  }
  
  toggleSubtitles() {
    this.subtitlesEnabled = !this.subtitlesEnabled;
  }
  
  updateProgress() {
    const video = this.videoRef.nativeElement;
    this.currentTime = video.currentTime;
  }
  
  updateBuffer() {
    const video = this.videoRef.nativeElement;
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      this.bufferPercent = (bufferedEnd / video.duration) * 100;
    }
  }
  
  seek(event: MouseEvent) {
    event.stopPropagation();
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    const video = this.videoRef.nativeElement;
    
    video.currentTime = pos * video.duration;
  }

  redo() {
    const video = this.videoRef.nativeElement;
    video.currentTime = 0;
    video.play();
  }
  
setVolume(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target && target.value) {
    const value = parseFloat(target.value);
    this.volume = value;
    const video = this.videoRef.nativeElement;
    video.volume = value;
    video.muted = value === 0;
    this.isMuted = value === 0;
  }
}
  
  changeQuality(index: number) {
    if (this.hls) {
      this.selectedQuality = index;
      this.hls.currentLevel = index;
      this.showQualityMenu = false;
    }
  }
  
  showControlsTemporarily() {
    this.showControls = true;
    clearTimeout(this.controlsTimeout);
    this.controlsTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.showControls = false;
      }
    }, 3000);
  }
  
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    } else {
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
  }
  
  skip(seconds: number) {
    const video = this.videoRef.nativeElement;
    video.currentTime += seconds;
  }
  
  toggleQualityMenu() {
    this.showQualityMenu = !this.showQualityMenu;
  }
  
  toggleVolumeSlider() {
    this.showVolumeSlider = !this.showVolumeSlider;
  }
  
  ngOnDestroy() {
    if (this.hls) {
      this.hls.destroy();
    }
    clearTimeout(this.controlsTimeout);
    if(this.isBrowser()) {
      try {
    document.removeEventListener('mousemove', this.showControlsTemporarily.bind(this));
    
    const video = this.videoRef.nativeElement;
    video.removeEventListener('timeupdate', this.updateProgress.bind(this));
    video.removeEventListener('loadedmetadata', this.initializeVideo.bind(this));
    video.removeEventListener('progress', this.updateBuffer.bind(this));
  } catch (error) {
      console.error('Error removing event listeners:', error);
    }
    }
  }
}