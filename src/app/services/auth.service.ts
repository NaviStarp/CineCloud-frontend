import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment'; // Importa el archivo de configuración

export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) { }

  // Devuelve la URL del servidor
  private getServerUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      console.log(environment.url);
      const ip =  environment.url  || localStorage.getItem('serverIp') ;
      const port =  environment.port || localStorage.getItem('serverPort');
      if (ip && port) {
        return `http://${ip}:${port}`;
      }
    }
    this.router.navigate(['/server/config']);
    throw new Error('Server IP or Port not set in localStorage or environment');
  }

  // Devuelve el token del usuario
  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Verifica si el usuario está logueado
  public async loggedIn(): Promise<boolean> {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': 'Token '
    };
    if (token) {
      headers['Authorization'] += token;
    }
    const response = await fetch(`${this.getServerUrl()}/token/test`, {
      method: 'GET',
      headers: headers,
    });
    return response.json();
  }

  // Prueba la conexión con el servidor
  public async testServer(ip: string, port: string): Promise<boolean> {
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

  // Cierra la sesión del usuario
  public logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  // Inicia sesión
  public login(user: User) {
    console.log(user);
    return fetch(`${this.getServerUrl()}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    }).then(res => res.json());
  }

  // Registra un nuevo usuario
  public signup(user: User) {
    return fetch(`${this.getServerUrl()}/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    }).then(res => res.json());
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Verifica si el usuario está logueado
  async canActivate(): Promise<GuardResult> {
    try {
      if (await this.authService.loggedIn()) {
        return true;
      }
    } catch (error) {
      console.error('Error verificando el token:', error);
    }

    // Redirigo al login si no esta logueado o si ocurre un error
    this.router.navigate(['/login']);
    return false;
  }
}
