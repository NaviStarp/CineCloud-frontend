import { Injectable } from '@angular/core';

export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login_url = 'http://localhost:8000/login/';
  register_url = 'http://localhost:8000/register/';
  constructor() { }
  private getToken() {
    return localStorage.getItem('token');
  }
  public loggedIn() {
    return !!localStorage.getItem('token');
  }
  public logout() {
    localStorage.removeItem('token');
  }
  
  public login(user: User) {
    return fetch(this.login_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    }).then(res => res.json());
  }
  public register(user: User) {
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
    };
    if (token) {
      headers['Token'] = token;
    }
    const response = await fetch('http://localhost:8000/prueba/', {
      method: 'GET',
      headers: headers,
    });
    return response.json();
  }
}
