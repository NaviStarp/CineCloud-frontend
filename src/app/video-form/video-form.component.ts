import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-video-form',
    imports: [CommonModule, FormsModule,ReactiveFormsModule],
    templateUrl: './video-form.component.html',
    styleUrls: ['./video-form.component.css']
})
export class VideoFormComponent {
    @Input() video: any; // Recibe el video desde el componente principal
    @Output() videoUpdated = new EventEmitter<any>(); // Emite el video actualizado

    isEditing = false;
    isVideoPlaying = false;

    toggleEdit(event?: Event): void {
        if (event) {
            event.stopPropagation();
        }
        this.isEditing = !this.isEditing;
    }

    playVideo(event: Event): void {
        event.stopPropagation();
        this.isVideoPlaying = !this.isVideoPlaying;
    }

    saveChanges(event: Event): void {
        event.preventDefault();
        this.videoUpdated.emit(this.video); // Emitir el video actualizado
        this.toggleEdit();
    }

    closeEdit(event: Event): void {
        event.stopPropagation();
        this.isEditing = false;
    }
}
