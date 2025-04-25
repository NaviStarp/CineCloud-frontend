import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { faPlay, faEdit, faTimes, faFilm, faPlus, faSearch, faTv } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IndexedDbService, VideoEntry } from '../../services/indexed-db.service';
import { AuthService, Series } from '../../services/auth.service';

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
export class VideoFormComponent implements OnInit,OnChanges {
  @Input() isEditing: boolean = false;
  @Input() video!: VideoEntry;
  @Input() actualizar: { value: boolean } = { value: false };

  @Output() videoChange = new EventEmitter<VideoEntry>();
  @Output() modalSerieToggle = new EventEmitter<boolean>();

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
    categories: [''],
    categorySearch: ''
  };

  // Constructor
  constructor(private indexedDbService: IndexedDbService, private auth: AuthService) {
    this.video = this.video || this.createEmptyVideoEntry();
  }
  ngOnChanges(changes: SimpleChanges){
    if(this.actualizar.value){
      const tamañoAntes = this.seriesList.length;
      this.loadSeries();
      const tamañoDespues = this.seriesList.length;

      if (this.seriesList.length > 0 && tamañoAntes < tamañoDespues) {
        const lastSeries = this.seriesList[this.seriesList.length - 1];
        this.autoFillSeasonAndChapter(lastSeries);
      }
      this.loadCategories();
      this.actualizar.value = false;
    }
  }

  ngOnInit(): void {
    this.loadSeries();
    this.loadCategories();
    // Ensure categories is initialized
    if (!this.video.categories || !Array.isArray(this.video.categories)) {
      this.video.categories = [];
    }
  }
  // Metodo que crea un video vacio
  // para evitar errores al cargar el componente
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

  toggleModalSerie(){
    this.modalSerieToggle.emit(true);
  }

  // Metodo que carga las categorias de la base de datos
  async loadCategories() {
    try {
      this.categories = await this.auth.getCategories();

      // Categorias populares limitadas a 8
      this.popularCategories = [...this.categories].slice(0, 8);
    }
    catch (error) {
      console.error('Error loading categories:', error);
    }
  }
  
  // Metodo de busqueda de categorias
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
  
  // Metodo que oculta las sugerencias de categorias
  // al hacer blur en el input
  onCategoryBlur() {
    // Use setTimeout to allow click events on suggestions to complete
    setTimeout(() => {
      this.showCategorySuggestions = false;
    }, 200);
  }
  // Metodo que añade una categoria al video
  // si no existe en el array de categorias
  // y la categoria no es vacia
  addCategory(category: string) {
    if (!category.trim()) return;
    
    // Inicializa el array de categorias si no existe
    if (!this.video.categories) {
      this.video.categories = [];
    }

    // No añadir si la categoria ya existe en el array
    if (this.video.categories.includes(category)) {
      return;
    }
    
    this.video.categories.push(category);
    this.categorySearch = '';
    this.showCategorySuggestions = false;
  }

  // Metodo que elimina una categoria del video
  // si existe en el array de categorias
  delCategory(category: string) {
    if (!category.trim() || !this.video.categories) return;
    
    const index = this.video.categories.indexOf(category);
    if (index !== -1) {
      this.video.categories.splice(index, 1);
    }
  }
  // Metodo que verifica si una categoria existe
  // en el array de categorias
  categoryExists(category: string): boolean {
    return this.categories.some(cat => cat.toLowerCase() === category.toLowerCase());
  }

  // Metodo que crea una categoria
  // si no existe en el array de categorias
  // y la categoria no es vacia  
  async createAndSelectCategory(category: string) {
    if (!category.trim()) return;
    
    try {
      if (!this.categoryExists(category)) {
        this.categories.push(category);
        
        await this.auth.createCategory(category);
        if(this.video.categories) this.video.categories.push(category);
        else this.video.categories = [category];
        this.categorySearch = '';
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
  /* METODOS PARA SERIES */
  

  // Metodo para busqueda de serie
  onSeriesSearch() {
    if (!this.seriesSearch) {
      this.filteredSeries = [...this.seriesList];
      return;
    }
    const search = this.seriesSearch.toLowerCase();
    this.filteredSeries = this.seriesList.filter(
      series => series.titulo.toLowerCase().includes(search)
    );
    console.log('Filtered series:', this.filteredSeries);
  }
  // Metodo para ocultar las sugerencias de series
  // al hacer blur en el input
  onSeriesBlur() {
    setTimeout(() => {
      this.showSeriesSuggestions = false;
    }, 200);
  }
  
  // Metodo para añadir una serie al video
  selectSeries(series: Series) {
    this.video.seriesId = series.id;
    this.video.seriesName = series.titulo;
    this.video.seriesDescription = series.descripcion;
    this.video.seriesReleaseDate = new Date(series.fecha_estreno);
    
    // Autocompletar temporada y capitulo
    this.autoFillSeasonAndChapter(series);
    
    this.seriesSearch = '';
    this.showSeriesSuggestions = false;
  }
  // Limpiar los atributos que le correspenden a un capitulo
  clearSeries() {
    this.video.seriesId = null;
    this.video.seriesName = '';
    this.video.seriesDescription = '';
    this.video.season = null;
    this.video.chapter = null;
  }
  
  // Metodo para extraer la imagen de una serie
  // y devolverla como thumbnail
  getSeriesThumbnail(seriesId: number): string | null {
    const series = this.seriesList.find(s => s.id === seriesId);
    return series ? series.imagen : null;
  }

  // Metodo para cargar series de la base de datos
  async loadSeries() {
    try {
      const series = await this.auth.getSeries();
      this.seriesList = series.map((serie: any) => ({
        ...serie,
        episodios: serie.episodios.map((episodio: any) => ({
          ...episodio,
        }))
      }));
      for(let i = 0; i < this.seriesList.length; i++) {
        const serie = this.seriesList[i];
        serie.imagen = await this.auth.getThumnailUrl(serie.imagen);
      }
      this.filteredSeries = [...this.seriesList];
    } catch (error) {
      console.error('Error loading series:', error);
    }
  }

  // Metodo para buscar categorias dentro del apartado de serie
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
  // Metodo para añadir una categoria a la serie
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
  // Metodo para eliminar una categoria de la serie
  delCategoryFromSeries(category: string) {
    if (!category.trim() || !this.newSeries.categories) return;
    
    const index = this.newSeries.categories.indexOf(category);
    if (index !== -1) {
      this.newSeries.categories.splice(index, 1);
    }
  }
  
  // Metodo para crear categoria y añadirla a la serie
  async createCategoryForSeries(category: string) {
    if (!category.trim()) return;
    
    try {
      // Add to global categories if it doesn't exist
      if (!this.categoryExists(category)) {
        this.categories.push(category);
        
        // Save to service
        await this.auth.createCategory(category);
        this.addCategoryToSeries(category);

        console.log(`Category "${category}" created successfully`);
      }
      
      // Add to series categories
    } catch (error) {
      console.error('Error creating category for series:', error);
    }
  }
  
  // Emitir evento para guardar los cambios
  saveChanges($event: Event) {
    $event.stopPropagation();
    console.log('Saving changes:', this.video);
    this.videoChange.emit(this.video);
    this.isEditing = false;
  }
  // Funcion que alterna la edición del video
  toggleEdit(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (!this.video.mediaType) {
      this.video.mediaType = 'Pelicula';
    }
    this.isEditing = !this.isEditing;
  }

  // Funcion que se encarga de cambiar el tipo del video
  setVideoType(type: 'Pelicula' | 'series') {
    this.video.mediaType = type;
  }

  onSeriesChange(event: any) {
    if (event.target.value === 'new') {
      this.toggleModalSerie();
      return;
    }
    
    const selectedSeriesId = Number(event.target.value);
    const selectedSeries = this.seriesList.find(serie => Number(serie.id) === selectedSeriesId);
    
    if (selectedSeries) {
      this.video.seriesId = selectedSeries.id;
      this.video.seriesName = selectedSeries.titulo;
      this.video.seriesDescription = selectedSeries.descripcion;
      this.video.seriesReleaseDate = new Date(selectedSeries.fecha_estreno);
      
      // Autocompletar temporada y capitulo
      this.autoFillSeasonAndChapter(selectedSeries);
    }
  }
  // Funcion que autocompleta la temporada y capitulo
  autoFillSeasonAndChapter(series: Series) {
    if (!series.episodios || series.episodios.length === 0) {
      // Si no hay episodios que empiece por la temporada 1, capitulo 1
      this.video.season = 1;
      this.video.chapter = 1;
      return;
    }
    
    // Encontrar la ultima temporada
    const maxSeason = Math.max(...series.episodios.map(ep => ep.temporada || 0));
    
    // Encontrar el ultimo capitulo de la ultima temporada
    const episodesInLastSeason = series.episodios.filter(ep => ep.temporada === maxSeason);
    let maxChapter = 0;
    
    if (episodesInLastSeason.length > 0) {
      maxChapter = Math.max(...episodesInLastSeason.map(ep => ep.numero || 0));
    }
    
    // Asignar la temporada y capitulo al video
    this.video.season = maxSeason;
    this.video.chapter = maxChapter + 1;
  }

  // Función para alternar la visibilidad del input de categoria
  toggleInputCategoria(){
    const inputCategoria = document.getElementById('inputCategoria');
    if (inputCategoria) {
      inputCategoria.classList.toggle('hidden');
    }
  }
}