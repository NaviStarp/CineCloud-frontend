import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
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

  login(): void {
    this.user = this.loginForm.value;

    // Si el formulario es inválido, marcamos todos los campos como tocados y salimos
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Establecer isLoading en true para mostrar el spinner
    this.isLoading = true;

    // Llamar al servicio de login
    this.auth.login(this.user).then((res: any) => {
      console.log(res);

      // Si el token existe, lo almacenamos en localStorage
      res.token ? this.token = res.token : this.token = '';
      if (this.token) {
        localStorage.setItem('token', this.token);
      }

      // Finalmente, después de recibir la respuesta, se establece isLoading en false
      this.isLoading = false;
    }).catch(error => {
      // Si hay un error, también se establece isLoading en false
      console.error('Error durante el inicio de sesión:', error);
      this.isLoading = false;
    });
  }

  pruebaF(): void {
    this.auth.prueba().then((res: any) => {
      console.log(res);
      res ? this.prueba = res : this.prueba = '';
    });
  }
}
