import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { faPlay, faEdit, faTimes, faFilm, faPlus, faSearch, faTv } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IndexedDbService, VideoEntry } from '../../services/indexed-db.service';
import { AuthService, Series } from '../../services/auth.service';

@Component({
  selector: 'app-serie-form',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule],
  templateUrl: './serie-form.component.html',
  styleUrl: './serie-form.component.css'
})
export class SerieFormComponent implements OnInit {
  @Input() video!: VideoEntry;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  // Estados
  isVideoPlaying = false;
  isEditing = false;
  isCreatingNewSeries = true; // Esta vista es el modal de creación

  // Categorías y series
  categories: string[] = [];
  popularCategories: string[] = [];
  videoUrl: string | null = null;

  // Variables para búsqueda
  categorySearch: string = '';
  showCategorySuggestions: boolean = false;
  filteredCategories: string[] = [];

  seriesSearch: string = '';
  showSeriesSuggestions: boolean = false;
  filteredSeries: Series[] = [];

  imagen: string = '';
  // Iconos
  faPlay = faPlay;
  faEdit = faEdit;
  faTimes = faTimes;
  faPlus = faPlus;
  faFilm = faFilm;
  faSearch = faSearch;
  faTv = faTv;

  // Variables para crear nueva serie
  seriesList: Series[] = [];
  newSeries = {
    name: '',
    description: '',
    releaseDate: new Date(),
    imagen: '',
    categories: [] as string[],
    categorySearch: ''
  };

  constructor(private indexedDbService: IndexedDbService, private auth: AuthService) {
    this.video = this.video || this.createEmptyVideoEntry();
  }

  ngOnInit(): void {
    this.loadCategories();

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
      if (!categories || categories.length === 0) {
        console.warn('No categories found');
        return;
      }
      this.categories = categories.map((category: any) => category.name);
      this.popularCategories = [...this.categories].slice(0, 8);
      this.filteredCategories = [...this.categories];
    } catch (error) {
    }
  }

  onCategorySearch() {
    if (!this.categorySearch) {
      this.filteredCategories = [...this.categories];
      return;
    }
    const search = this.categorySearch.toLowerCase();
    this.filteredCategories = this.categories.filter(cat => cat.toLowerCase().includes(search));
  }

  onSeriesCategorySearch() {
    if (!this.newSeries.categorySearch) {
      this.filteredCategories = [...this.categories];
      return;
    }
    const search = this.newSeries.categorySearch.toLowerCase();
    this.filteredCategories = this.categories.filter(cat => cat.toLowerCase().includes(search));
  }

  onCategoryBlur() {
    setTimeout(() => {
      this.showCategorySuggestions = false;
    }, 200);
  }

  addCategory(category: string) {
    if (!category.trim()) return;
    if (!this.video.categories) {
      this.video.categories = [];
    }
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

  addCategoryToSeries(category: string) {
    if (!category.trim()) return;
    if (!this.newSeries.categories) {
      this.newSeries.categories = [];
    }
    if (this.newSeries.categories.includes(category)) {
      return;
    }
    this.newSeries.categories.push(category);
    this.newSeries.categorySearch = '';
    this.showCategorySuggestions = false;
  }

  delCategoryFromSeries(category: string) {
    if (!category.trim() || !this.newSeries.categories) return;
    const index = this.newSeries.categories.indexOf(category);
    if (index !== -1) {
      this.newSeries.categories.splice(index, 1);
    }
  }

  categoryExists(category: string): boolean {
    return this.categories.some(cat => cat.toLowerCase() === category.toLowerCase());
  }

  async createAndSelectCategory(category: string) {
    if (!category.trim()) return;
    try {
      if (!this.categoryExists(category)) {
        this.categories.push(category);
        await this.auth.createCategory(category);
        console.log(`Category "${category}" created successfully`);
        if (this.popularCategories.length < 8) {
          this.popularCategories.push(category);
        }
      }
      this.addCategory(category);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  }

  async createCategoryForSeries(category: string) {
    if (!category.trim()) return;
    try {
      if (!this.categoryExists(category)) {
        this.categories.push(category);
        await this.auth.createCategory(category);
        console.log(`Category "${category}" created successfully`);
        if (this.popularCategories.length < 8) {
          this.popularCategories.push(category);
        }
      }
      this.addCategoryToSeries(category);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  }

  onSeriesSearch() {
    if (!this.seriesSearch) {
      this.filteredSeries = [...this.seriesList];
      return;
    }
    const search = this.seriesSearch.toLowerCase();
    this.filteredSeries = this.seriesList.filter(series => series.titulo.toLowerCase().includes(search));
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

  autoFillSeasonAndChapter(series: Series) {
    if (!series.episodios || series.episodios.length === 0) {
      this.video.season = 1;
      this.video.chapter = 1;
      return;
    }
    const maxSeason = Math.max(...series.episodios.map(ep => ep.temporada || 0));
    const episodesInLastSeason = series.episodios.filter(ep => ep.temporada === maxSeason);
    let maxChapter = 0;
    if (episodesInLastSeason.length > 0) {
      maxChapter = Math.max(...episodesInLastSeason.map(ep => ep.numero || 0));
    }
    this.video.season = maxSeason;
    this.video.chapter = maxChapter + 1;
  }

  cancelCreateSeries() {
    this.closeModal.emit();
  }

  async saveNewSeries() {
    if (!this.newSeries.name.trim()) {
      console.error('El nombre de la serie es requerido');
      return;
    }
    try {
     
      const newSeriesId = Date.now();
      const createdSeries: Series = {
        id: newSeriesId,
        titulo: this.newSeries.name,
        descripcion: this.newSeries.description,
        categorias: this.newSeries.categories || [],
        imagen: this.newSeries.imagen || this.video.thumbnail,
        temporadas: 1,
        fecha_estreno: this.newSeries.releaseDate.toString(),
        episodios: []
      };
      console.log(createdSeries)
      await this.auth.createSeries(createdSeries);

      this.closeModal.emit(); // Emitir evento para cerrar el modal
      
      // Cerrar el modal en el componente padre
      const parent = document.querySelector('app-video-card');
      if (parent) {
        const component = (parent as any).__ngContext__?.instance;
        if (component) {
          component.isCreatingNewSeries = false;
        }
      }
      
      console.log('Serie creada correctamente:', createdSeries);
    } catch (error) {
      console.error('Error creando la serie:', error);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.imagen = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (result.startsWith('data:image')) {
          this.newSeries.imagen = result; 
        } else {
          console.log('No es una imagen', result);
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file);
    }
  }
  }
