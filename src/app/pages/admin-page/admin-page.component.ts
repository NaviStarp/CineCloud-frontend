import { Component } from '@angular/core';
import { HeaderComponent } from '../../general/header/header.component';
import { AuthService, Category, User } from '../../services/auth.service';
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
  itemToDelete: { type: 'admin' | 'category', id: string } | null = null;
  showModalConfirmar: boolean = false;
  constructor(private auth: AuthService) {
    this.loadData();
  }

  private loadData() {
    this.auth.getCategoriesFull().then((res) => {
      this.categories = res;
    }).catch((err) => {
      console.log(err);
    }); 
    this.categories=this.categories.sort((a, b) => a.nombre.localeCompare(b.nombre));

    this.auth.getAdministrators().then((res) => {
      this.administrators = res;
    }).catch((err) => {
      console.log(err);
    });
   this.administrators=this.administrators.sort((a, b) => a.username.localeCompare(b.username));
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

  openConfirmModal(type: 'admin' | 'category', id: string) {
    this.itemToDelete = { type, id };
    this.showModalConfirmar = true;
  }

  confirmDelete() {
    if (!this.itemToDelete) return;

    if (this.itemToDelete.type === 'admin') {
      this.deleteAdmin(this.itemToDelete.id);
    } else {
      this.deleteCategory(this.itemToDelete.id);
    }

    this.showModalConfirmar = false;
    this.itemToDelete = null;
  }

  // Admin methods
  handleAdmin(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const adminData :User= {
      username: formData.get('nombre') as string,
      password: formData.get('contraseña') as string,
    }

    if(this.editId === ''){
      this.addAdmin(adminData);
    }else{
      this.editAdmin(adminData);
    }
  }
  addAdmin(data : User) {
    this.auth.createAdmin(data).then((res) => {
      console.log('Admin added successfully:', res);
      this.loadData();
    }
    ).catch((err) => {
      console.error('Error adding admin:', err);
    }
    );
    this.closeModal();
  }

  editAdmin(data:  User) {
    try {
      this.auth.editUser(data, this.editId).then((res) => {
        console.log('Admin edited successfully:', res);
        this.loadData(); 
      }
      ).catch((err) => {
        console.error('Error editing admin:', err);
      }
      );
    }
    catch (error) {
      console.error('Error editing admin:', error);
    }

    this.closeModal();
  }

  deleteAdmin(adminId: string) {
    this.auth.deleteUser(adminId).then((res) => { 
      console.log('Admin deleted successfully:', res);
      this.loadData();
    }).catch((err) => {
      console.error('Error deleting admin:', err);
    });
  }

  // Funciones de categoria
    handleCategory(event: Event) {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const categoryData = {
        nombre: formData.get('nombre') as string,
      }
      if (this.editId) {
        this.editCategory(categoryData.nombre);
      } else {
        this.addCategory(categoryData.nombre);
      }
  }
  addCategory(category: string) {
    this.auth.createCategory(category).then((res) => {
      console.log('Category added successfully:', res);
      this.loadData();
    }).catch((err) => {
      console.error('Error adding category:', err);
    });
    this.closeModal();
  }

  editCategory(category:string) {
    try {
      this.auth.editCategory(this.editId,category).then((res) => {
        console.log('Category edited successfully:', res);
        this.loadData(); 
      }
      ).catch((err) => {
        console.error('Error editing category:', err);
      }
      );
    }catch (error) {
      console.error('Error editing category:', error);
    }
    this.closeModal();
  }

  deleteCategory(id: string) {
    this.auth.deleteCategory(id).then((res) => {  
      console.log('Category deleted successfully:', res);
      this.loadData();
    }
    ).catch((err) => {
      console.error('Error deleting category:', err);
    });
  }
}