import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBars, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'media-header',
  imports: [FaIconComponent,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit {
  // Variables
  @Input() categorias: string[] = [];
  @Input() opcionSeleccionada:string|null = null;
  @Input() mostrarBusqueda:boolean = true;
  @Output() busquedaCambio: EventEmitter<string> = new EventEmitter<string>();
  //Busqueda
  busqueda:string = '';
  scroll: boolean = false;
  mobileMenuVisible = false;
  mobileSearchVisible = false;
  // Iconos
  faSearch = faSearch;
  faTimes = faTimes;
  faBars = faBars;
  constructor() {
  }
    
    ngOnInit() {
    console.log(this.categorias);
    console.log(this.opcionSeleccionada);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
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
    }

  /**
   * Emite el valor de búsqueda al componente padre
   * @param event El evento de entrada
   * @param value El valor de búsqueda
    **/
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
  }
