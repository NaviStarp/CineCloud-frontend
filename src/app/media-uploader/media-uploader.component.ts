import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight,faTimes, faCloudUploadAlt, faFileAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import { ModalErrorComponent } from "../general/modal-error/modal-error.component";
import { IndexedDbService } from '../services/indexed-db.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-media-uploader',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ModalErrorComponent],
  templateUrl: './media-uploader.component.html',
  styleUrls: ['./media-uploader.component.css'],
  animations: [
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateY(20px)',
        opacity: 0,
        backdropFilter: 'brightness(50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      })),
      transition('void <=> *', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ]
})
export class MediaUploaderComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInfo') fileInfo!: ElementRef<HTMLDivElement>;

  constructor(private indexedDbService: IndexedDbService) {}
  
  selectedFiles: File[] = [];
  modalAbierta = false;
  tituloError = "";
  mensajeError="";
  errorVisible = false;
  
  faTimes = faTimes;
  faFileAlt = faFileAlt;
  faCloudUploadAlt = faCloudUploadAlt;
  faUpload = faUpload;
  faArrowRight = faArrowRight;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      if(!this.compatibleFiles(Array.from(input.files))){
        this.tituloError = "Error";
        this.mensajeError = "El archivo no es compatible";
        this.errorVisible = true;
        return;
      }
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
      if(!this.compatibleFiles(Array.from(event.dataTransfer.files))){
        this.tituloError = "Error";
        this.mensajeError = "El archivo no es compatible";
        this.errorVisible = true;
        return;
      }
      this.selectedFiles = this.selectedFiles.concat(Array.from(event.dataTransfer.files));
      // Update file input to reflect dropped files
      const dataTransfer = new DataTransfer();
      this.selectedFiles.forEach(file => {
        dataTransfer.items.add(file);
      });
      
      this.fileInput.nativeElement.files = dataTransfer.files;
    }
  }

  compatibleFiles(files: File[] = this.selectedFiles) {
    let compatible = true;
    files.forEach(file => {
      if (!/\.(mp4|avi|mkv|mov|wmv)$/i.test(file.name)) {
        compatible = false;
      }
      else if (!file.type.includes('video')) {
      compatible = false;
      }  
    });
    return compatible;
  }

  clearFiles() {
    this.selectedFiles = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  continuar() {
    if (this.selectedFiles.length > 0) {
      console.log('Archivos: ', this.selectedFiles);
      // Guardar videos de forma secuencial
      this.selectedFiles.forEach((file, index) => {
        this.indexedDbService.saveVideo(file).then(() => {
          console.log(`Video ${file.name} guardado correctamente`);
          window.location.href = '/subir/2';
        }).catch((error) => {
          console.error(`Error al guardar el video ${file.name}:`, error);
        });
      });
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