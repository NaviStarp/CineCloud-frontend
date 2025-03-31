import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';
import { FormFooterComponent } from '../form-footer/form-footer.component';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    FormFooterComponent
  ],
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent {
  @Input() registerForm!: FormGroup;
  @Input() isLoading: boolean = false;
  @Output() formSubmit = new EventEmitter<void>();

  onSubmit(): void {
    this.formSubmit.emit();
  }
}