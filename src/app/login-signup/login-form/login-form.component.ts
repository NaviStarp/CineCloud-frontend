import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';
import { FormFooterComponent } from '../form-footer/form-footer.component';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    FormFooterComponent
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  @Input() loginForm!: FormGroup;
  @Input() isLoading: boolean = false;
  @Output() formSubmit = new EventEmitter<void>();
  faUser = faUser;
  faLock = faLock;

  constructor(private library:FaIconLibrary) {
    this.library.addIcons(faUser, faLock);
  }
  

  onSubmit(): void {
    this.formSubmit.emit();
  }
}