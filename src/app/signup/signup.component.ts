import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RedirectCommand } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  username: string = '';
  password: string = '';
  prueba: string = '';
  token: string | null = '';
  user = {
    username: this.username,
    password: this.password
  };

  register(): void {
    alert('hola');
    this.user = this.registerForm.value;
    console.log(this.user);
    // Si el formulario es inválido, marcamos todos los campos como tocados y salimos
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Establecer isLoading en true para mostrar el spinner
    this.isLoading = true;

    // Llamar al servicio de login
    this.auth.register(this.user).then((res: any) => {
      console.log(res);

      // Si el token existe, lo almacenamos en localStorage
      res.token ? this.token = res.token : this.token = '';
      if (this.token) {
        localStorage.setItem('token', this.token);
      }
      // Finalmente, después de recibir la respuesta, se establece isLoading en false
      this.isLoading = false;
      window.location.href = '/';
    }).catch(error => {
      // Si hay un error, también se establece isLoading en false
      console.error('Error durante el inicio de sesión:', error);
      this.isLoading = false;
    });
  }


}
