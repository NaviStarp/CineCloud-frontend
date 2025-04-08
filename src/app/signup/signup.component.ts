import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HeaderComponent } from '../login-signup/header/header.component';
import { SignupFormComponent } from '../login-signup/signup-form/signup-form.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, SignupFormComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
      passwordConfirmation: new FormControl('', [Validators.required, Validators.minLength(2)]),
    }, {
      validators: this.passwordsMatch
    });
  }
  // Comprobar que las contraseñas sean iguales
  private passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const passwordConfirmation = group.get('passwordConfirmation')?.value;
    return password === passwordConfirmation ? null : { passwordsMismatch: true };
  }

  register(): void {
    // Si el formulario es inválido, marcamos todos los campos como tocados y salimos
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Establecer isLoading en true para mostrar el spinner
    this.isLoading = true;

    const user = this.registerForm.value;
    
    // Llamar al servicio de login
    interface SignupResponse {
      token?: string;
      user?: {
        id: number;
        username: string;
      };
    }

    interface SignupError {
      message: string;
    }

    this.auth.signup(user).then((res: SignupResponse) => {
      console.log(res);
      // Si el token existe, lo almacenamos en localStorage
      if (res.token) {
      localStorage.setItem('token', res.token);
      }
      if(res.user){
        localStorage.setItem('user', JSON.stringify(res.user));
      }
      // Finalmente, después de recibir la respuesta, se establece isLoading en false
      this.isLoading = false;
      window.location.href = '/';
    }).catch((error: SignupError) => {
      // Si hay un error, también se establece isLoading en false
      console.error('Error durante el inicio de sesión:', error);
      this.isLoading = false;
      this.errorMessage = 'Error al crear la cuenta';
    });
  }
}