import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { faPlay, faEdit, faTimes, faFilm, faPlus, faSearch, faTv } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IndexedDbService, VideoEntry } from '../services/indexed-db.service';
import { AuthService, Series } from '../services/auth.service';

@Component({
  selector: 'app-video-form',
  templateUrl: './video-form.component.html',
  styleUrls: ['./video-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  animations: [
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateY(-20px)',
        opacity: 0
      })),
      transition('void <=> *', [
        animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ]),
  ]
})
export class VideoFormComponent implements OnInit {
  @Input() video!: VideoEntry;

  @Output() videoChange = new EventEmitter<VideoEntry>();
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  isVideoPlaying = false;
  isEditing = false;
  categories: string[] = [];
  popularCategories: string[] = [];
  videoUrl: string | null = null;

  categorySearch: string = '';
  showCategorySuggestions: boolean = false;
  filteredCategories: string[] = [];
  
  seriesSearch: string = '';
  showSeriesSuggestions: boolean = false;
  filteredSeries: Series[] = [];
  
  // Font Awesome icons
  faPlay = faPlay;
  faEdit = faEdit;
  faTimes = faTimes;
  faPlus = faPlus;
  faFilm = faFilm;
  faSearch = faSearch;
  faTv = faTv;
  
  seriesList: Series[] = [];
  isCreatingNewSeries = false;
  newSeries = { 
    name: '', 
    description: '', 
    releaseDate: new Date(), 
    categories: [''],
    categorySearch: ''
  };

  constructor(private indexedDbService: IndexedDbService, private auth: AuthService) {
    // Initialize video if not provided
    this.video = this.video || this.createEmptyVideoEntry();
  }

  ngOnInit(): void {
    this.loadSeries();
    this.loadCategories();
    
    // Ensure categories is initialized
    if (!this.video.categories || !Array.isArray(this.video.categories)) {
      this.video.categories = [];
    }
  }

  private createEmptyVideoEntry(): VideoEntry {
    return {
      id: '',
      videoBlob: new File([], ''),
      description: '',
      videoMime: '',
      video: null,
      name: '',
      thumbnail: '',
      mediaType: 'Pelicula',
      releaseDate: new Date(),
      seriesId: null,
      categories: [],
      season: null,
      chapter: null,
      seriesName: '',
      seriesDescription: '',
      seriesReleaseDate: new Date(),
    };
  }

  async loadCategories() {
    try {
      const categories = await this.auth.getCategories();
      console.log('Categories loaded:', categories);
      if (!categories || categories.length === 0) {
        console.warn('No categories found');
        return;
      }
      this.categories = categories.map((category: any) => category.name);
      
      // Set popular categories (first 8)
      this.popularCategories = [...this.categories].slice(0, 8);
    }
    catch (error) {
      console.error('Error loading categories:', error);
    }
  }
  
  // Category management methods
  onCategorySearch() {
    if (!this.categorySearch) {
      this.filteredCategories = [...this.categories];
      return;
    }
    
    const search = this.categorySearch.toLowerCase();
    this.filteredCategories = this.categories.filter(
      cat => cat.toLowerCase().includes(search)
    );
  }
  
  onCategoryBlur() {
    // Use setTimeout to allow click events on suggestions to complete
    setTimeout(() => {
      this.showCategorySuggestions = false;
    }, 200);
  }
  
  addCategory(category: string) {
    if (!category.trim()) return;
    
    // Initialize categories array if it doesn't exist
    if (!this.video.categories) {
      this.video.categories = [];
    }
    
    // Don't add if category already exists in the array
    if (this.video.categories.includes(category)) {
      return;
    }
    
    this.video.categories.push(category);
    this.categorySearch = '';
    this.showCategorySuggestions = false;
  }
  
  delCategory(category: string) {
    if (!category.trim() || !this.video.categories) return;
    
    const index = this.video.categories.indexOf(category);
    if (index !== -1) {
      this.video.categories.splice(index, 1);
    }
  }
  
  categoryExists(category: string): boolean {
    return this.categories.some(cat => cat.toLowerCase() === category.toLowerCase());
  }
  
  async createAndSelectCategory(category: string) {
    if (!category.trim()) return;
    
    try {
      // Add to categories if it doesn't exist
      if (!this.categoryExists(category)) {
        this.categories.push(category);
        
        // Save to service
        await this.auth.createCategory(category);
        console.log(`Category "${category}" created successfully`);
        
        // Update popular categories if needed
        if (this.popularCategories.length < 8) {
          this.popularCategories.push(category);
        }
      }
      
      // Add to video categories
      this.addCategory(category);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  }

  // Series-related methods
  onSeriesSearch() {
    if (!this.seriesSearch) {
      this.filteredSeries = [...this.seriesList];
      return;
    }
    
    const search = this.seriesSearch.toLowerCase();
    this.filteredSeries = this.seriesList.filter(
      series => series.titulo.toLowerCase().includes(search)
    );
  }
  
  onSeriesBlur() {
    setTimeout(() => {
      this.showSeriesSuggestions = false;
    }, 200);
  }
  
  selectSeries(series: Series) {
    this.video.seriesId = series.id;
    this.video.seriesName = series.titulo;
    this.video.seriesDescription = series.descripcion;
    this.video.seriesReleaseDate = new Date(series.fecha_estreno);
    
    // Auto-fill season and chapter
    this.autoFillSeasonAndChapter(series);
    
    this.seriesSearch = '';
    this.showSeriesSuggestions = false;
  }
  
  clearSeries() {
    this.video.seriesId = null;
    this.video.seriesName = '';
    this.video.seriesDescription = '';
    this.video.season = null;
    this.video.chapter = null;
  }
  
  getSeriesThumbnail(seriesId: number): string | null {
    const series = this.seriesList.find(s => s.id === seriesId);
    return series ? series.imagen : null;
  }

  // Series loading and creation methods
  async loadSeries() {
    try {
      const series = await this.auth.getSeries();
      this.seriesList = series.map((serie: any) => ({
        ...serie,
        episodios: serie.episodios.map((episodio: any) => ({
          ...episodio,
        }))
      }));
      this.filteredSeries = [...this.seriesList];
    } catch (error) {
      console.error('Error loading series:', error);
    }
  }

  // Series category methods
  onSeriesCategorySearch() {
    if (!this.newSeries.categorySearch) {
      this.filteredCategories = [...this.categories];
      return;
    }
    
    const search = this.newSeries.categorySearch.toLowerCase();
    this.filteredCategories = this.categories.filter(
      cat => cat.toLowerCase().includes(search)
    );
  }
  
  addCategoryToSeries(category: string) {
    if (!category.trim()) return;
    
    // Initialize series categories array if needed
    if (!this.newSeries.categories) {
      this.newSeries.categories = [];
    }
    
    // Don't add if category already exists in the array
    if (this.newSeries.categories.includes(category)) {
      return;
    }
    
    this.newSeries.categories.push(category);
    this.newSeries.categorySearch = '';
  }
  
  delCategoryFromSeries(category: string) {
    if (!category.trim() || !this.newSeries.categories) return;
    
    const index = this.newSeries.categories.indexOf(category);
    if (index !== -1) {
      this.newSeries.categories.splice(index, 1);
    }
  }
  
  async createCategoryForSeries(category: string) {
    if (!category.trim()) return;
    
    try {
      // Add to global categories if it doesn't exist
      if (!this.categoryExists(category)) {
        this.categories.push(category);
        
        // Save to service
        await this.auth.createCategory(category);
        console.log(`Category "${category}" created successfully`);
      }
      
      // Add to series categories
      this.addCategoryToSeries(category);
    } catch (error) {
      console.error('Error creating category for series:', error);
    }
  }

  async loadVideo() {
    try {
      console.log("Loading video:", this.video);
      this.videoUrl = await this.indexedDbService.getVideo(this.video.id);
      if (this.videoUrl) {
        console.log("Video URL generated:", this.videoUrl);
      } else {
        console.error("Failed to get video URL for ID:", this.video.id);
      }
    } catch (error) {
      console.error("Error loading video:", error);
    }
  }
  
  saveChanges($event: Event) {
    $event.stopPropagation();
    console.log('Saving changes:', this.video);
    this.videoChange.emit(this.video);
    this.isEditing = false;
  }

  toggleEdit(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.video.mediaType) {
      this.video.mediaType = 'Pelicula';
    }
    this.isEditing = !this.isEditing;
  }

  async playVideo(event: Event) {
    event.stopPropagation();
    await this.loadVideo();

    setTimeout(() => {
      this.isVideoPlaying = !this.isVideoPlaying;
    }, 100);
  }

  closeVideo(event: Event) {
    event.stopPropagation();
    this.isVideoPlaying = false;
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
    }

    this.video.mediaType = this.video.mediaType || 'Pelicula';
    event.preventDefault();
    this.videoChange.emit(this.video);
    this.isEditing = false;
  }

  setVideoType(type: 'Pelicula' | 'series') {
    this.video.mediaType = type;
  }

  onSeriesChange(event: any) {
    if (event.target.value === 'new') {
      this.openCreateSeriesModal();
      return;
    }
    
    const selectedSeriesId = Number(event.target.value);
    const selectedSeries = this.seriesList.find(serie => Number(serie.id) === selectedSeriesId);
    
    if (selectedSeries) {
      this.video.seriesId = selectedSeries.id;
      this.video.seriesName = selectedSeries.titulo;
      this.video.seriesDescription = selectedSeries.descripcion;
      this.video.seriesReleaseDate = new Date(selectedSeries.fecha_estreno);
      
      // Auto-fill season and chapter
      this.autoFillSeasonAndChapter(selectedSeries);
    }
  }
  
  autoFillSeasonAndChapter(series: Series) {
    if (!series.episodios || series.episodios.length === 0) {
      // If no episodes, start with season 1, chapter 1
      this.video.season = 1;
      this.video.chapter = 1;
      return;
    }
    
    // Find last season
    const maxSeason = Math.max(...series.episodios.map(ep => ep.temporada || 0));
    
    // Find last chapter of last season
    const episodesInLastSeason = series.episodios.filter(ep => ep.temporada === maxSeason);
    let maxChapter = 0;
    
    if (episodesInLastSeason.length > 0) {
      maxChapter = Math.max(...episodesInLastSeason.map(ep => ep.numero || 0));
    }
    
    // Suggest next chapter in same season
    this.video.season = maxSeason;
    this.video.chapter = maxChapter + 1;
  }

  openCreateSeriesModal() {
    this.isCreatingNewSeries = true;
    this.newSeries = { 
      name: '', 
      description: '', 
      releaseDate: new Date(),
      categories: [],
      categorySearch: ''
    };
  }

  cancelCreateSeries() {
    this.isCreatingNewSeries = false;
    if (this.video.seriesId === 0) {
      this.video.seriesId = null;
    }
  }

  toggleInputCategoria(){
    const inputCategoria = document.getElementById('inputCategoria');
    if (inputCategoria) {
      inputCategoria.classList.toggle('hidden');
    }
  }

  async saveNewSeries() {
    if (!this.newSeries.name.trim()) {
      console.error('Series name is required');
      return;
    }
    
    try {
      const newSeriesId = Date.now();
      const createdSeries: Series = {
        id: newSeriesId,
        titulo: this.newSeries.name,
        descripcion: this.newSeries.description,
        categorias: this.newSeries.categories || [],
        temporadas: 1,
        imagen: this.video.thumbnail || '', // Use video thumbnail
        fecha_estreno: this.newSeries.releaseDate.toString(),
        episodios: []
      };

      // Save series in AuthService
      await this.auth.createSeries(createdSeries);
      
      // Update local series list
      this.seriesList.push(createdSeries);
      this.filteredSeries = [...this.seriesList];

      // Update video with new series info
      this.video.seriesId = newSeriesId;
      this.video.seriesName = this.newSeries.name;
      this.video.seriesDescription = this.newSeries.description;
      this.video.seriesReleaseDate = this.newSeries.releaseDate;
      
      // First episode of first season
      this.video.season = 1;
      this.video.chapter = 1;

      this.isCreatingNewSeries = false;
      this.videoChange.emit(this.video);
      
      console.log('Series created successfully:', createdSeries);
    } catch (error) {
      console.error('Error creating series:', error);
    }
  }
}