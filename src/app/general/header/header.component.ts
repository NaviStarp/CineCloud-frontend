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
    console.log(this.opcionSeleccionada);
    this.scroll = scrollPosition > 10;
  }
}
