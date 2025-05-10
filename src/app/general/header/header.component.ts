import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Injectable, Input, OnInit, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBars, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'media-header',
  standalone: true,
  imports: [FaIconComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // Variables
  @Input() categorias: string[] = [];
  @Input() opcionSeleccionada: string | null = null;
  @Input() mostrarBusqueda: boolean = true;
  @Output() busquedaCambio: EventEmitter<string> = new EventEmitter<string>();
  
  // Búsqueda
  busqueda: string = '';
  scroll: boolean = false;
  mostrarBotonSubir: boolean = false;
  mobileMenuVisible = false;
  mobileSearchVisible = false;
  
  // Iconos
  faSearch = faSearch;
  faTimes = faTimes;
  faBars = faBars;

  constructor(private auth: AuthService) {
    this.auth.isAdmin().then((isAdmin) => {
      this.mostrarBotonSubir = isAdmin;
    });
  }

  ngOnInit() {
    console.log('Categorías:', this.categorias);
    console.log('Opción seleccionada:', this.opcionSeleccionada);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = document.documentElement.scrollTop;
    this.scroll = scrollPosition > 10;
  }

  /**
   * Hace scroll hasta la categoría seleccionada
   * @param category La categoría a la que hacer scroll
   */
  scrollToCategory(category: string): void {
    const element = document.getElementById(category);
    if (element) {
      const offset = 100; // Ajustar el valor según sea necesario
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    this.opcionSeleccionada = category;
  }

  /**
   * Emite el valor de búsqueda al componente padre
   * @param event El evento de entrada
   */
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement | null;
    this.busqueda = target?.value || '';
    this.busquedaCambio.emit(this.busqueda);
  }

  toggleMobileMenu() {
    this.mobileMenuVisible = !this.mobileMenuVisible;
    // Cerrar búsqueda si está abierta
    if (this.mobileMenuVisible && this.mobileSearchVisible) {
      this.mobileSearchVisible = false;
    }
  }

  toggleMobileSearch() {
    this.mobileSearchVisible = !this.mobileSearchVisible;
    // Cerrar menú si está abierto
    if (this.mobileSearchVisible && this.mobileMenuVisible) {
      this.mobileMenuVisible = false;
    }
  }

  /**
   * Calcula la altura del espaciador según el estado actual
   */
  calculateSpacerHeight(): number {
    if (this.categorias.length === 0) {
      return 48; // Altura básica sin categorías
    }
    
    if (this.mobileMenuVisible || this.mobileSearchVisible) {
      return 120; // Altura con menú móvil o búsqueda abiertos
    }
    
    if (!this.scroll && this.categorias.length > 0) {
      return 120; // Altura completa con categorías visibles
    }
    
    return 64; // Altura reducida con scroll
  }
}