import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTimes, faUpload, faImage, faInfoCircle, faCheck,
  faExclamationTriangle, faPlus, faEye,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { AuthService, EditMedia } from '../../services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class EditModalComponent implements OnInit {
  @Input() id: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() imageUrl: string = '';
  @Input() releaseDate: string = '';
  @Input() selectedCategories: string[] = [];
  @Input() type: string = '';

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();

  // Icons
  faTimes = faTimes;
  faUpload = faUpload;
  faImage = faImage;
  faInfoCircle = faInfoCircle;
  faCheck = faCheck;
  faExclamationTriangle = faExclamationTriangle;
  faPlus = faPlus;
  faEye = faEye;
  faSearch = faSearch;

  categories: string[] = [];
  popularCategories: string[] = [];
  categorySearch: string = '';
  showCategorySuggestions: boolean = false;
  filteredCategories: string[] = [];

  thumbnail: string | null = null;
  thumbnailUrl: string = '';

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.getCategories().then((res) => {
      this.categories = res;
      this.popularCategories = this.categories.slice(0, 5);
      this.filteredCategories = [...this.popularCategories];
    });

    if (this.imageUrl) {
      this.thumbnail = this.imageUrl;
      this.thumbnailUrl = this.imageUrl;
    }

    if (!this.selectedCategories) {
      this.selectedCategories = [];
    }
  }

  async onSubmit() {
    var formData: EditMedia = {
      id: this.id,
      titulo: this.title,
      descripcion: this.description,
      imagen: this.imageUrl || this.thumbnailUrl,
      fecha_estreno: this.releaseDate,
      categorias: this.selectedCategories,
    };
    if (this.imageUrl && this.imageUrl.startsWith('http')) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const promise = new Promise<void>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
        ctx.drawImage(img, 0, 0);
        formData.imagen = canvas.toDataURL('image/png');
        }
        resolve();
      };
      img.onerror = () => {
        console.error("Failed to convert image URL to base64");
        reject();
      };
      });
      img.src = this.imageUrl;
      await promise;
    }
    console.log(this.type)
    console.log(formData);
    if (this.type === 'serie') {
      this.auth.editSeries(formData).then(() => {
        this.save.emit();
        this.close.emit();
      }
      ).catch((err) => {
        console.error(err);
      }
      );
    } else if (this.type === 'pelicula') {
      this.auth.editMovie(formData).then(() => {
        this.save.emit();
        this.close.emit();
      }
      ).catch((err) => {
        console.error(err);
      }
      );
    }
  }

  toggleCategory(category: string) {
    if (!this.selectedCategories) {
      this.selectedCategories = [];
    }

    const index = this.selectedCategories.indexOf(category);
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
  }

  removeCategory(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
    }
  }

  onCategorySearch() {
    if (!this.categorySearch) {
      this.filteredCategories = [...this.popularCategories];
      return;
    }

    const search = this.categorySearch.toLowerCase();
    this.filteredCategories = this.categories.filter(
      cat => cat.toLowerCase().includes(search)
    );
    this.showCategorySuggestions = true;
  }

  onCategoryBlur() {
    setTimeout(() => {
      this.showCategorySuggestions = false;
    }, 200);
  }

  addCategory(category: string) {
    if (!category.trim()) return;

    if (!this.selectedCategories) {
      this.selectedCategories = [];
    }

    if (!this.selectedCategories.includes(category)) {
      this.selectedCategories.push(category);
    }

    this.categorySearch = '';
    this.showCategorySuggestions = false;
  }

  categoryExists(category: string): boolean {
    return this.categories.some(cat => cat.toLowerCase() === category.toLowerCase());
  }

  createAndSelectCategory(category: string) {
    if (!category.trim()) return;

    if (!this.categoryExists(category)) {
      this.categories.push(category);
      if (this.popularCategories.length < 8) {
        this.popularCategories.push(category);
      }
    }

    this.addCategory(category);
  }

  // Thumbnail methods
  onThumbnailSelected($event: Event) {
    const input = $event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnail = reader.result as string;
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeThumbnail() {
    this.imageUrl = '';
    this.thumbnail = null;
    this.thumbnailUrl = '';
  }

  loadFromUrl() {
    if (!this.thumbnailUrl) return;

    // Validate URL
    try {
      new URL(this.thumbnailUrl);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imageUrl = this.thumbnailUrl;
        this.thumbnail = this.thumbnailUrl;
      };
      img.onerror = () => {
        console.error("Failed to load image from URL");
      };
      img.src = this.thumbnailUrl;
    } catch (_) {
      console.error("Invalid URL");
    }
  }
}