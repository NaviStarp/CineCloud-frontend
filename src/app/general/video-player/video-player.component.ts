import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, PLATFORM_ID, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBackward, faChevronDown, faCog, faCompress, faExpand, faForward, faPause, faPlay, faRedo, faTachometerAlt, faTimes, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import Hls from 'hls.js';
import { BehaviorSubject, Subject, Subscription, debounceTime, filter, takeUntil } from 'rxjs';
import { AuthService, VideoProgress } from '../../services/auth.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() videoUrl: string = 'http://localhost:8000/hls/pelicula/Cubo/playlist.m3u8';
  @Input() videoTitle: string = '';
  @Input() episodeInfo: string = '';
  @Input() videoId: string = '';
  @Input() videoType: string = '';
  @Input() episodes: any[] = [];
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
  faTimes = faTimes;
  faTachometerAlt = faTachometerAlt;
  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;
  hls!: Hls;
  authToken: string = '';
  qualityLevels: { index: number; label: string }[] = [];
  speeds: { label: string; value: number }[] = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1x', value: 1 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '1.75x', value: 1.75 },
    { label: '2x', value: 2 },
  ];
  currentSpeed: number = 1;
  selectedQuality: number = -1; // -1 para "Auto"
  
  isPlaying: boolean = false;
  isMuted: boolean = false;
  isFullscreen: boolean = false;
  showControls: boolean = true;
  controlsTimeout: any;
  showSpeedMenu: boolean = false;  
  currentTime: number = 0;
  duration: number = 0;
  
  // Mejoras en el seguimiento del progreso
  private progressSubject = new BehaviorSubject<number>(0);
  private progressSubscription: Subscription | null = null;
  private savedProgress: number = 0;
  private progressSaveInterval = 2000; // 2 segundos
  private progressSaveThreshold = 0.01; // Guardar solo si el progreso cambia más del 1%
  private lastSavedProgress = 0;
  private destroy$ = new Subject<void>();
  private videoInitialized = false;
  private progressRestored = false;
  volume: number = 1;
  bufferPercent: number = 0;
  
  subtitlesEnabled: boolean = false;
  showQualityMenu: boolean = false;
  showVolumeSlider: boolean = false;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.setupHotkeys();
    if (this.isBrowser()) {
      try {
        this.authToken = localStorage.getItem('token') || '';
        this.setupProgressTracking();
      } catch (error) {
        console.error('Error al acceder a localStorage:', error);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoUrl'] && !changes['videoUrl'].firstChange) {
      console.log('La URL del video cambió:', changes['videoUrl'].currentValue);
      this.reloadVideo();
    }
    
    if (changes['videoId'] && !changes['videoId'].firstChange) {
      this.progressRestored = false;
      this.videoInitialized = false;
      this.fetchSavedProgress();
    }
  }

  private setupHotkeys(): void {
    document.onkeyup = (event: KeyboardEvent) => {
      if (event.key === 'f') {
        this.toggleFullscreen();
      } else if (event.key === 'm') {
        this.toggleMute();
      } else if (event.key === ' ') {
        this.togglePlay();
      } else if (event.key === 'ArrowRight') {
        this.skip(10);
      } else if (event.key === 'ArrowLeft') {
        this.skip(-10);
      } else if (event.key === 'r') {
        this.redo();
      } else if (event.key === 's') {
        this.toggleSpeedMenu();
      }
      else if (event.key === 'v') {
        this.toggleVolumeSlider();
      } else if (event.key === 'q') {
        this.toggleQualityMenu();
      } else if (event.key === 'Escape') {
        this.isFullscreen = false;
      } 
    }
  }

  private setupProgressTracking(): void {
    // Limpiar cualquier suscripción existente
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }

    // Configurar el seguimiento del progreso
    this.progressSubscription = this.progressSubject.pipe(
      debounceTime(this.progressSaveInterval),
      filter(progress => {
        // Guardar solo si el progreso cambió significativamente o estamos cerca del final
        const shouldSave = 
          Math.abs(progress - this.lastSavedProgress) > this.progressSaveThreshold ||
          progress > 0.95; // Siempre guardar cuando estamos cerca del final
        if (shouldSave) {
          this.lastSavedProgress = progress;
        }
        return shouldSave;
      }),
      takeUntil(this.destroy$)
    ).subscribe(progress => {
      this.saveVideoProgress(progress);
    });

    // Obtener el progreso guardado para el video actual
    this.fetchSavedProgress();
  }

  private fetchSavedProgress(): void {
    if (!this.videoId) return;
    
    // Obtener el progreso guardado del servicio según el tipo de video
    if (this.videoType === 'pelicula') {
      this.auth.getMovieProgress(this.videoId).then(progress => {
        this.handleSavedProgress(progress);
      }).catch(error => {
        console.error('Error al obtener el progreso de la película:', error);
      });
    } else if (this.videoType === 'serie') {
      this.auth.getEpisodeProgress(this.videoId).then(progress => {
        this.handleSavedProgress(progress);
      }).catch(error => {
        console.error('Error al obtener el progreso del episodio:', error);
      });
    }
  }

  private handleSavedProgress(progress: VideoProgress | null): void {
    if (progress) {
      // Convertir de escala 0-100 a 0-1
      this.savedProgress = progress.progress / 100;
      this.lastSavedProgress = this.savedProgress;
      
      // Si el video ya está inicializado, buscar la posición guardada
      if (this.videoInitialized && !this.progressRestored) {
        this.seekToSavedPosition();
      }
    }
  }

  private seekToSavedPosition(): void {
    if (!this.videoRef || !this.savedProgress || this.progressRestored) return;

    const video = this.videoRef.nativeElement;
    
    // Restaurar solo si el progreso guardado está entre el 1% y el 95%
    if (this.savedProgress > 0.01 && this.savedProgress < 0.95) {
      video.currentTime = this.savedProgress * video.duration;
      this.progressRestored = true;
      console.log(`Progreso del video restaurado al ${Math.round(this.savedProgress * 100)}%`);
    }
  }

  private saveVideoProgress(progress: number): void {
    if (!this.videoId) return;
    
    // No guardar cantidades de progreso muy pequeñas
    if (progress < 0.01) return;
    
    // Guardar el progreso como porcentaje (0-100)
    const videoProgress: VideoProgress = {
      videoId: this.videoId,
      progress: Math.floor(progress * 100), // Convertir a escala de 0-100 para mayor precisión
    };
    
    console.log(`Guardando progreso: ${videoProgress.progress}%`);
    
    if (this.videoType === 'pelicula') {
      this.auth.setMovieProgress(videoProgress);
    } else if (this.videoType === 'serie') {
      this.auth.setEpisodeProgress(videoProgress);
    }
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  setup(): void {
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
    video.addEventListener('ended', this.handleVideoEnded.bind(this));
    
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
    this.eventEmitter();
  }
  
  eventEmitter() {
    this.videoClosed.subscribe(() => {
      this.setup();
    });
  }
    
  initializeHls(video: HTMLVideoElement) {
    if (this.hls) {
      this.hls.destroy();
    }

    this.hls = new Hls({
      xhrSetup: (xhr: XMLHttpRequest) => {
        xhr.setRequestHeader('Authorization', `Token ${this.authToken}`);
      },
      startLevel: -1, // Auto quality selection
    });
    
    this.hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS error:', data);
      if (data.fatal) {
        switch(data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.log('Network error, attempting recovery...');
            this.hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log('Media error, attempting recovery...');
            this.hls.recoverMediaError();
            break;
          default:
            console.log('Fatal error, cannot recover');
            this.hls.destroy();
            break;
        }
      }
    });
    
    console.log("Loading URL:", this.videoUrl);
    
    this.hls.loadSource(this.videoUrl);
    this.hls.attachMedia(video);
    
    this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
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
    
    // When media is attached, handle any saved progress
    this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log('HLS media attached');
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
    this.videoInitialized = true;
    
    // Attempt to restore progress after video metadata is loaded
    if (!this.progressRestored && this.savedProgress > 0) {
      this.seekToSavedPosition();
    }
  }
  
  updateProgress() {
    const video = this.videoRef.nativeElement;
    this.currentTime = video.currentTime;
    
    // Calculate progress as percentage (0-1)
    const progress = video.currentTime / video.duration;
    
    // Update the progress subject
    this.progressSubject.next(progress);
  }
  
  updateBuffer() {
    const video = this.videoRef.nativeElement;
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      this.bufferPercent = (bufferedEnd / video.duration) * 100;
    }
  }
  
  handleVideoEnded() {
    // Mark video as complete in the system
    if (this.videoId) {
      const videoProgress: VideoProgress = {
        videoId: this.videoId,
        progress: 100, // 100% complete
      };
      
      if (this.videoType === 'pelicula') {
        this.auth.setMovieProgress(videoProgress);
      } else if (this.videoType === 'serie') {
        this.auth.setEpisodeProgress(videoProgress);
        // Automatically play next episode if available
        if (this.isThereNextEpisode()) {
          setTimeout(() => this.nextEpisode(), 3000); // Wait 3 seconds before auto-playing next episode
        }
      }
    }
  }
  
  reloadVideo() {
    const video = this.videoRef.nativeElement;
    console.log("Reloading video:", this.videoUrl);
    
    // Reset progress tracking
    this.progressRestored = false;
    this.videoInitialized = false;
    this.lastSavedProgress = 0;
    
    // Pause and clear current source
    video.pause();
    video.removeAttribute('src');
    video.load();
    
    // Destroy previous HLS instance if it exists
    if (this.hls) {
      this.hls.destroy();
    }
  
    // Reinitialize the video
    if (Hls.isSupported()) {
      this.initializeHls(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      this.initializeNativeHls(video);
    }
    
    // Fetch saved progress for the new video
    this.fetchSavedProgress();
    
    video.play();
  }
  
  togglePlay() {
    const video = this.videoRef.nativeElement;
    if (video.paused) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }
  toggleSpeedMenu() {
    this.showSpeedMenu = !this.showSpeedMenu;
  }
  
  toggleMute() {
    const video = this.videoRef.nativeElement;
    video.muted = !video.muted;
    this.isMuted = video.muted;
    if (this.isMuted) {
      this.volume = 0;
    } else {
      this.volume = video.volume > 0 ? video.volume : 0.5; // Restore to previous volume or default
    }
    video.volume = this.volume;
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
  
  seek(event: MouseEvent) {
    event.stopPropagation();
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    const video = this.videoRef.nativeElement;
    
    // Set new position
    video.currentTime = pos * video.duration;
    
    // Save the new position immediately if it's a significant jump
    const newProgress = pos;
    if (Math.abs(newProgress - this.lastSavedProgress) > 0.05) {
      this.saveVideoProgress(newProgress);
      this.lastSavedProgress = newProgress;
    }
  }

  nextEpisode() {
    const currentIndex = this.episodes.findIndex(episode => episode.videoUrl === this.videoUrl);
    if (currentIndex < this.episodes.length - 1) {
      const nextEpisode = this.episodes[currentIndex + 1];
      this.videoUrl = nextEpisode.video;
      this.videoTitle = nextEpisode.title;
      this.episodeInfo = `${nextEpisode.season}x${nextEpisode.episode}`;
      this.videoId = nextEpisode.id;
      this.reloadVideo();
    }
  }
  
  isThereNextEpisode(): boolean {
    const currentIndex = this.episodes.findIndex(episode => episode.videoUrl === this.videoUrl);
    return currentIndex < this.episodes.length - 1;
  }
  
  redo() {
    const video = this.videoRef.nativeElement;
    video.currentTime = 0;
    video.play();
    // Reset progress tracking
    this.lastSavedProgress = 0;
    this.saveVideoProgress(0);
  }
  
  changeSpeed(speed: number) {
    this.currentSpeed = speed;
    const video = this.videoRef.nativeElement;
    video.playbackRate = speed;
    this.showSpeedMenu = false;
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
    // Clean up HLS instance
    if (this.hls) {
      this.hls.destroy();
    }
    
    // Save final progress
    const video = this.videoRef?.nativeElement;
    if (video && video.duration) {
      const finalProgress = video.currentTime / video.duration;
      this.saveVideoProgress(finalProgress);
    }
    
    // Clean up observables
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
    
    // Clean up timeouts
    clearTimeout(this.controlsTimeout);
    
    // Remove event listeners
    if (this.isBrowser()) {
      try {
        document.removeEventListener('mousemove', this.showControlsTemporarily.bind(this));
        
        const video = this.videoRef?.nativeElement;
        if (video) {
          video.removeEventListener('timeupdate', this.updateProgress.bind(this));
          video.removeEventListener('loadedmetadata', this.initializeVideo.bind(this));
          video.removeEventListener('progress', this.updateBuffer.bind(this));
          video.removeEventListener('ended', this.handleVideoEnded.bind(this));
        }
      } catch (error) {
        console.error('Error removing event listeners:', error);
      }
    }
  }
}