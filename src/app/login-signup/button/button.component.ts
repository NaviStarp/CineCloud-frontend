import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() loadingText: string = 'Cargando...';
  @Input() text: string = 'Enviar';
  @Input() type: 'submit' | 'button' | 'reset' = 'submit';
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.isLoading) {
      this.buttonClick.emit();
    }
  }
}