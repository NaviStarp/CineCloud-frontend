import { Component } from '@angular/core';
import { HeaderComponent } from '../../general/header/header.component';
import { AuthService, Category } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { 
  faChevronRight, 
  faCircle, 
  faEdit, 
  faFolder, 
  faKey, 
  faShield, 
  faTag, 
  faTags, 
  faThLarge, 
  faTrash, 
  faUser,
  faChevronLeft,
  faPlus,
  faTimes,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FaIconComponent, FormsModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
  // Existing properties
  categories: Category[] = [];
  administrators: any[] = [];
  
  // New properties
  activeTab: string = 'administrators';
  showModal: boolean = false;
  modalType: 'addAdmin' | 'editAdmin' | 'addCategory' | 'editCategory' = 'addAdmin';
  editId: string = '';
  // Icons
  faEdit = faEdit;
  faTrash = faTrash;
  faUser = faUser;
  faShield = faShield;
  faKey = faKey;
  faFolder = faFolder;
  faTag = faTag;
  faTags = faTags;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faPlus = faPlus;
  faTimes = faTimes;
  faExclamationTriangle = faExclamationTriangle;
  faCheckCircle = faCheckCircle;

  constructor(private auth: AuthService) {
    this.loadData();
  }

  private loadData() {
    this.auth.getCategoriesFull().then((res) => {
      this.categories = res;
    }).catch((err) => {
      console.log(err);
    }); 

    this.auth.getAdministrators().then((res) => {
      this.administrators = res;
    }).catch((err) => {
      console.log(err);
    });
  }

  // Modal methods
  openModal(type: 'addAdmin' | 'editAdmin' | 'addCategory' | 'editCategory', id?: string) {
    this.modalType = type;
    this.showModal = true;
    this.editId = id || '';
  }

  closeModal() {
    this.showModal = false;
  }

  // Admin methods
  handleAdmin(form: any) {
    if(this.editId === ''){
      this.addAdmin(form);
    }else{
      this.editAdmin(this.editId);
    }
  }
  addAdmin(form: any) {
    console.log('Adding admin:', form);
    this.closeModal();
  }

  editAdmin(adminId: string) {
    // Implement edit admin logic
    console.log('Editing admin:', adminId);
    this.closeModal();
  }

  deleteAdmin(adminId: string) {
    console.log('Deleting admin:', adminId);
  }

  // Funciones de categoria
  addCategory(form: any) {
    console.log('Adding category:', form);
    this.closeModal();
  }

  editCategory() {
    console.log('Editing category:', this.editId);
    this.openModal('editCategory');
  }

  deleteCategory() {
    console.log('Deleting category:', this.editId);
  }
}