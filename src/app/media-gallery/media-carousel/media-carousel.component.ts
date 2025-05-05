import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MediaCardComponent } from '../media-card/media-card.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-media-carousel',
  imports: [CommonModule, MediaCardComponent,RouterModule],
  templateUrl: './media-carousel.component.html',
  styleUrl: './media-carousel.component.css'
})
export class MediaCarouselComponent {
  @Input() items: any[] = [];
  @Input() itemType: string = 'pelicula';
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;
  @ViewChild('carouselSlider') carouselSlider!: ElementRef;
  
  currentIndex: number = 0;
  itemWidth: number = 280; 
  itemsPerPage: number = 4;
  maxIndex: number = 0;
  currentPage: number = 0;
  pages: number = 1;
  
  constructor() {}  
  
  ngAfterViewInit() {
    this.removeDuplicates();
    console.log('Carousel initialized with items:', this.items);
    setTimeout(() => this.calculateItemsPerPage(), 0);
    
    window.addEventListener('resize', () => {
      this.calculateItemsPerPage();
    });
  }
  
  calculateItemsPerPage() {
    const containerWidth = this.carouselContainer.nativeElement.offsetWidth;
    
    if (containerWidth < 640) {
      this.itemsPerPage = 1;
    } else if (containerWidth < 768) {
      this.itemsPerPage = 2;
    } else if (containerWidth < 1024) {
      this.itemsPerPage = 3;
    } else {
      this.itemsPerPage = 4;
    }
    
    this.itemWidth = containerWidth / this.itemsPerPage;
    this.maxIndex = Math.max(0, this.items.length - this.itemsPerPage);
    this.pages = Math.ceil(this.items.length / this.itemsPerPage);
    
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
      this.updateCurrentPage();
  
      if (this.currentIndex + this.itemsPerPage >= this.items.length) {
        this.currentPage = this.pages - 1;
      }
    }
  }
  
  scroll(direction: number) {
    const newIndex = this.currentIndex + (direction * this.itemsPerPage);

    if (newIndex < 0) {
      this.currentIndex = 0;
    } else if (newIndex >= this.items.length) {
      this.currentIndex = this.items.length - this.itemsPerPage;
    } else {
      this.currentIndex = newIndex;
    }

    const offset = -(this.currentIndex * this.itemWidth);
    this.carouselSlider.nativeElement.style.transform = `translateX(${offset}px)`;

    this.updateCurrentPage();
  }
  goToPage(pageIndex: number) {
    this.currentIndex = Math.min(pageIndex * this.itemsPerPage, this.maxIndex);
    this.currentPage = pageIndex;
  }
  
  updateCurrentPage() {
    this.currentPage = Math.floor(this.currentIndex / this.itemsPerPage);
  }
  
  getDots() {
    return new Array(this.pages);
  }
  removeDuplicates() {
    this.items = this.items.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.id === item.id
      ))
    );
    console.log('Items after removing duplicates:', this.items);

  }

}
