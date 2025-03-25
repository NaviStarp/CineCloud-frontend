import { CommonModule } from '@angular/common';
import { Component ,Input,Output,EventEmitter } from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-modal-error',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './modal-error.component.html',
  styleUrl: './modal-error.component.css'
})
export class ModalErrorComponent {
  @Input() title: string = 'Error';
  @Input() message: string = 'Ha ocurrido un error inesperado.';
  @Input() visible: boolean = false;
  @Output() cerrarModal = new EventEmitter<void>();

  faExclamationTriangle = faExclamationTriangle;
  cerrar() {
    console.log('cerrar');
    this.cerrarModal.emit();
  }

}
