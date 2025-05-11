import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../login-signup/header/header.component';
import { LoginFormComponent } from '../login-signup/login-form/login-form.component';
import { Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { env } from 'process';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,HeaderComponent,LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private auth: AuthService, private fb: FormBuilder,private router:Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(2)]],
    });
  }
  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      const serverUrl = localStorage.getItem('serverIp') || environment.url;
      const serverPort = localStorage.getItem('serverPort') || environment.port;
      
      if(!serverPort || !serverUrl){
        console.log('No se encontro el servidor asdsas',serverPort,serverUrl);
        this.router.navigate(['/server/config']);
        return;
      }
      this.auth.testServer(serverUrl, serverPort).then((res: any) => {
      if(!res){
        alert('No se pudo conectar al servidor');
        this.router.navigate(['/server/config']);
      }
      });
    }
    this.auth.loggedIn().then((res: any) => {
      if (res) {
        this.router.navigate(['/']);
      }
    }
    );
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
      this.errorMessage = "Campos invalidos";
      this.isLoading = false;
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
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        // Finalmente, después de recibir la respuesta, se establece isLoading en false
        this.isLoading = false;
        this.router.navigate(['/']);
      }else{
        this.errorMessage = "Usuario o contraseña incorrectos";
        this.isLoading = false;
      }

        }).catch(error => {
      // Si hay un error, también se establece isLoading en false
      console.error('Error durante el inicio de sesión:', error);
      this.errorMessage = error;
      this.isLoading = false;
    });
  }
}
