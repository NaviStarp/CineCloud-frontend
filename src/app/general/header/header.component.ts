import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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
  scroll: boolean = false;
  // Iconos
  faSearch = faSearch;

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
}
