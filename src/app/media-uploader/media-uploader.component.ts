import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight,faTimes, faCloudUploadAlt, faFileAlt, faUpload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-media-uploader',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './media-uploader.component.html',
  styleUrls: ['./media-uploader.component.css']
})
export class MediaUploaderComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInfo') fileInfo!: ElementRef<HTMLDivElement>;
  
  selectedFiles: File[] = [];
  modalAbierta = false;
  
  faTimes = faTimes;
  faFileAlt = faFileAlt;
  faCloudUploadAlt = faCloudUploadAlt;
  faUpload = faUpload;
  faArrowRight = faArrowRight;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = this.selectedFiles.concat(Array.from(input.files));
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add('border-blue-500');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('border-blue-500');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('border-blue-500');

    if (event.dataTransfer?.files) {
      this.selectedFiles = this.selectedFiles.concat(Array.from(event.dataTransfer.files));
      
      // Update file input to reflect dropped files
      const dataTransfer = new DataTransfer();
      this.selectedFiles.forEach(file => {
        dataTransfer.items.add(file);
      });
      
      this.fileInput.nativeElement.files = dataTransfer.files;
    }
  }

  clearFiles() {
    this.selectedFiles = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  subir() {
    if (this.selectedFiles.length > 0) {
      console.log('Archivos a subir:', this.selectedFiles);
      // Aquí implementarías la lógica de subida de archivos
      // Por ejemplo, usando HttpClient para enviar los archivos al servidor
    } else {
      console.log('No hay archivos seleccionados');
    }
  }

  toggleModal() {
    this.modalAbierta = !this.modalAbierta;
  }


  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }
}