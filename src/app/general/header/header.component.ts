import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBars, faSearch, faTimes, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { Themes } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'media-header',
  standalone: true,
  imports: [FaIconComponent, CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // Entradas y salidas
  @Input() categorias: string[] = [];
  @Input() opcionSeleccionada: string | null = null;
  @Input() mostrarBusqueda: boolean = true;
  @Output() busquedaCambio: EventEmitter<string> = new EventEmitter<string>();
  @Output() categoriaSeleccionada: EventEmitter<string> = new EventEmitter<string>();
  
  // Variables de estado
  busqueda: string = '';
  scroll: boolean = false;
  showBackToTop: boolean = false;
  mobileMenuVisible = false;
  mobileSearchVisible = false;
  themeMenuVisible = false;
  isAdmin = false;

  // Gestión de temas
  Themes = Themes;
  currentTheme: Themes;
  availableThemes = Object.entries(Themes).map(([key, value]) => ({ key, value }));
  
  // Iconos
  faSearch = faSearch;
  faTimes = faTimes;
  faBars = faBars;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;

  // Seguimiento de la posición de scroll
  private scrollPosition$ = new BehaviorSubject<number>(0);

  constructor(private authService: AuthService, private themeService: ThemeService) {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.checkAdminStatus();
    this.setupScrollTracking();
  }

  ngOnInit() {
    // Verificación inicial del scroll
    this.onWindowScroll();
  }


  /**
   * Verifica si el usuario actual tiene privilegios de administrador
   */
  private async checkAdminStatus(): Promise<void> {
    try {
      this.isAdmin = await this.authService.isAdmin();
    } catch (error) {
      console.error('Error al verificar el estado de administrador:', error);
      this.isAdmin = false;
    }
  }

  /**
   * Configura el seguimiento de los cambios en la posición de scroll
   */
  private setupScrollTracking(): void {
    this.scrollPosition$.subscribe(position => {
      this.scroll = position > 10;
      this.showBackToTop = position > 300;
      
      // Cerrar el menú de temas al hacer scroll
      if (this.themeMenuVisible && position > 10) {
        this.themeMenuVisible = false;
      }
    });
  }

  /**
   * Cierra el menú de temas al hacer clic fuera
   */
  private closeThemeMenuOnClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.themeMenuVisible && !target.closest('.theme-menu-container')) {
      this.themeMenuVisible = false;
    }
  }

  /**
   * Manejador del evento de scroll de la ventana
   */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    const position = document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.scrollPosition$.next(position);
  }

  /**
   * Alterna la visibilidad del menú de temas
   */
  toggleThemeMenu(): void {
    this.themeMenuVisible = !this.themeMenuVisible;
    console.log('Menú de temas visible:', this.themeMenuVisible);
  }

  /**
   * Cambia el tema de la aplicación
   * @param themeKey La clave del tema a establecer
   */
  changeTheme(themeKey: string): void {
    const themeValue = Themes[themeKey as keyof typeof Themes];
  
    if (themeValue) {
      this.themeService.setTheme(themeValue);
      this.currentTheme = themeValue;
      this.themeMenuVisible = false; // Cerrar el menú de temas después de la selección
    } else {
      console.error(`Selección de tema inválida: ${themeKey}`);
    }
  }

  /**
   * Obtiene el color de un tema
   * @param themeKey La clave del tema para obtener el color
   */
  getThemeColor(themeKey: string): string {
    switch (themeKey) {
      case 'PURPLE':
      case 'Morado':
        return '#8b5cf6'; // Morado
      case 'RED':
      case 'Rojo':
        return '#ef4444'; // Rojo
      case 'ORANGE':
      case 'Naranja':
        return '#f97316'; // Naranja
      case 'GREEN':
      case 'Verde':
        return '#22c55e'; // Verde
      case 'BLUE':
      case 'Azul':
        return '#3b82f6'; // Azul
      default:
        return '#3b82f6';
    }
  }

  /**
   * Hace scroll a la categoría seleccionada
   * @param category La categoría a la que hacer scroll
   */
  scrollToCategory(category: string): void {
    const element = document.getElementById(category);
    if (element) {
      const headerHeight = this.getHeaderHeight();
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - 20; // Espaciado adicional
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    this.opcionSeleccionada = category;
    this.categoriaSeleccionada.emit(category);
    
    // Cerrar el menú móvil después de la selección
    if (this.mobileMenuVisible) {
      this.toggleMobileMenu();
    }
  }

  /**
   * Maneja la entrada de búsqueda y emite el valor de búsqueda
   * @param event El evento de entrada
   */
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.busqueda = target?.value || '';
    this.busquedaCambio.emit(this.busqueda);
  }

  /**
   * Alterna la visibilidad del menú móvil
   */
  toggleMobileMenu(): void {
    this.mobileMenuVisible = !this.mobileMenuVisible;
    
    // Cerrar la búsqueda si se está abriendo el menú
    if (this.mobileMenuVisible && this.mobileSearchVisible) {
      this.mobileSearchVisible = false;
    }
    
    // Cerrar el menú de temas al abrir el menú móvil
    if (this.themeMenuVisible) {
      this.themeMenuVisible = false;
    }
  }

  /**
   * Alterna la visibilidad de la búsqueda móvil
   */
  toggleMobileSearch(): void {
    this.mobileSearchVisible = !this.mobileSearchVisible;
    
    // Cerrar el menú si se está abriendo la búsqueda
    if (this.mobileSearchVisible && this.mobileMenuVisible) {
      this.mobileMenuVisible = false;
    }
    
    // Cerrar el menú de temas al abrir la búsqueda móvil
    if (this.themeMenuVisible) {
      this.themeMenuVisible = false;
    }
  }

  /**
   * Hace scroll hacia la parte superior de la página
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Calcula la altura actual del encabezado según el estado
   */
  getHeaderHeight(): number {
    const baseHeight = this.scroll ? 48 : 64;
    const categoryBarHeight = (!this.scroll && this.categorias.length > 0) ? 36 : 0;
    
    return baseHeight + categoryBarHeight;
  }

  /**
   * Calcula la altura del espaciador para el contenido de la página
   */
  calculateSpacerHeight(): number {
    const headerHeight = this.getHeaderHeight();
    const mobileMenuHeight = (this.mobileMenuVisible || this.mobileSearchVisible) ? 56 : 0;
    
    return headerHeight + mobileMenuHeight;
  }

  /**
   * Limpia el campo de búsqueda
   */
  clearSearch(): void {
    this.busqueda = '';
    this.busquedaCambio.emit('');
  }
}