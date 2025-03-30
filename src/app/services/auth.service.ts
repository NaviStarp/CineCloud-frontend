import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import {  CanActivate, GuardResult, MaybeAsync, Router} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login_url = 'http://localhost:8000/login/';
  register_url = 'http://localhost:8000/signup/';
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  
  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  public loggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  public logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }
  
  public login(user: User) {
    console.log(user);
    return fetch(this.login_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    }).then(res => res.json());
  }

  public signup(user: User) {
    return fetch(this.register_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    }).then(res => res.json());
  }

  public async prueba() {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': 'Token '
    };
    if (token) {
      headers['Authorization'] += token;
    }
    const response = await fetch('http://localhost:8000/prueba/', {
      method: 'GET',
      headers: headers,
    });
    return response.json();
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): MaybeAsync<GuardResult> {
    if (this.authService.loggedIn()) {
      return true;
    }
    
    // Redirigo al login si no esta logueado
    this.router.navigate(['/login']);
    return false;
  }
}
