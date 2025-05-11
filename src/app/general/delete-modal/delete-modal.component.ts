import { Component, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  imports: [FormsModule,CommonModule,FaIconComponent],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css'
})
export class DeleteModalComponent {
  @Input() id: string = '';
  @Input() type: string = '';
  @Input() title: string = '';

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  name: string = '';
  faExclamationTriangle = faExclamationTriangle;

  constructor(private auth:AuthService) { }

  close() {
    this.closeModal.emit();
  }

  confirm() {
    if (this.name !== this.title) {
      return;
    }
    if (this.type === 'pelicula') {
      this.deleteMovie();
    } else if (this.type === 'serie') {
      this.deleteSeries();
    }
  }

  private deleteMovie() {
    this.auth.deleteMovie(this.id).then((res) => {
      if (res) {
        this.close();
        window.location.href = '/';
      }
    }).catch((err) => {
      console.error(err);
      this.close();
    });
  }

  private deleteSeries() {
    this.auth.deleteSeries(this.id).then((res) => {
      if (res) {
        this.close();
        window.location.href = '/';
      }
    }).catch((err) => {
      console.error(err);
      this.close();
    });
  }
  }

