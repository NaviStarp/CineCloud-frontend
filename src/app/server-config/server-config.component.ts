import { Component } from '@angular/core';
import { InputComponent } from "../login-signup/input/input.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from "../login-signup/button/button.component";
import { FaIconComponent, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faServer, faSignal, faCheckCircle, faExclamationTriangle, faSpinner, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-config',
  standalone: true,
  imports: [InputComponent, ButtonComponent, CommonModule, FaIconComponent,FontAwesomeModule],
  templateUrl: './server-config.component.html',
  styleUrl: './server-config.component.css'
})
export class ServerConfigComponent {
  serverConfigForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  redirectMessage = '';
  loadingProgress = 0;
  loadingInterval: any;
  serverIp: string = '';
  
  // Icons
  faServer = faServer;
  faStatus = faQuestionCircle;
  faSuccess = faCheckCircle;
  faError = faExclamationTriangle;
  faSpinner = faSpinner;
  constructor(private library: FaIconLibrary,private router:Router) {
    this.library.addIcons(faServer, faSignal, faCheckCircle, faExclamationTriangle, faSpinner,faQuestionCircle);
    this.serverConfigForm = new FormGroup({
      serverUrl: new FormControl('', [Validators.required]),
      serverPort: new FormControl('', [Validators.required]),
    });
  }
  
  async testServer(): Promise<void> {
    if (this.serverConfigForm.invalid) {
      this.serverConfigForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.redirectMessage = '';
    this.loadingProgress = 0;
    
    // Progress bar animation
    this.loadingInterval = setInterval(() => {
      if (this.loadingProgress < 90) {
        this.loadingProgress += Math.random() * 10;
        if (this.loadingProgress > 90) this.loadingProgress = 90;
      }
    }, 500);
    
    const { serverUrl, serverPort } = this.serverConfigForm.value;
    
    // Simulate loading for at least 4.5 seconds
    setTimeout(async () => {
      try {
        const isServerOk = await this.testServerConnection(serverUrl, serverPort);
        
        this.loadingProgress = 100;
        setTimeout(() => {
          clearInterval(this.loadingInterval);
          
          if (isServerOk) {
            this.serverIp = serverUrl;
            this.successMessage = 'Conexión exitosa. Configuración guardada.';
            this.redirectMessage = 'Redirigiendo al panel principal en 5 segundos...';
            this.faStatus = faSignal;
            let count = 3;
            const countdownInterval = setInterval(() => {
              count--;
              if (count <= 0) {
                clearInterval(countdownInterval);
                this.router.navigate(['/']);
                localStorage.setItem('serverIp', serverUrl);
                localStorage.setItem('serverPort', serverPort);
                
              } else {
                this.redirectMessage = `Redirigiendo al panel principal en ${count} segundos...`;
              }
            }, 1000);
            
          } else {
            this.faStatus = faExclamationTriangle;
            this.errorMessage = 'El servidor no está disponible. Verifique la dirección y el puerto.';
          }
          
          this.isLoading = false;
          
        }, 500);
        
      } catch (error) {
        clearInterval(this.loadingInterval);
        this.loadingProgress = 0;
        console.error('Error al probar el servidor:', error);
        this.errorMessage = 'Error al conectar con el servidor. Verifique su conexión a internet.';
        this.isLoading = false;
      }
    }, 1000);
  }
  
  private async testServerConnection(ip: string, port: string): Promise<boolean> {
    try {
      const response = await fetch(`http://${ip}:${port}/status/`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Error testing server:', error);
      return false;
    }
  }
}