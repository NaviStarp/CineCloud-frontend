import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment'; // Importa el archivo de configuración
import { VideoEntry } from './indexed-db.service';

export interface User {
  username: string;
  password: string;
}

export interface MediaResponse {
  peliculas: any[];
  series: any[];
  episodios: any[];
}
export interface Episode {
  id: number;
  titulo: string;
  temporada: number;
  numero: number;
  descripcion: string;
  imagen: string;
}

export interface Series {
  id: number;
  episodios: Episode[];
  titulo: string;
  descripcion: string;
  fecha_estreno: string;
  temporadas: number;
  imagen: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) { }

  // Devuelve la URL del servidor
  public getServerUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      console.log(environment.url);
      const ip =  environment.url  || localStorage.getItem('serverIp') ;
      const port =  environment.port || localStorage.getItem('serverPort');
      if (ip && port) {
        return `http://${ip}:${port}`;
      }
    }
    this.router.navigate(['/server/config']);
    return '';
  }

  // Devuelve el token del usuario
  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
  public getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser.id ? parsedUser.id.toString() : null;
      }
      return localStorage.getItem('user.id');
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
  public async uploadVideos(videos: VideoEntry[]) {
    const formData = new FormData();
    
    videos.forEach((video, index) => {
      formData.append(`videos[${index}][name]`, video.name);
      formData.append(`videos[${index}][description]`, video.description || '');
      
      formData.append(`videos[${index}][video]`, video.videoBlob, video.name);
      
      if (typeof video.thumbnail === 'string' && video.thumbnail.startsWith('data:image')) {
        const byteString = atob(video.thumbnail.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        formData.append(`videos[${index}][thumbnail]`, blob, `${video.name}-thumbnail.jpg`);
      }
      
      formData.append(`videos[${index}][mediaType]`, video.mediaType);
      
      const releaseDate = video.releaseDate instanceof Date ? video.releaseDate : new Date(video.releaseDate);
      formData.append(`videos[${index}][releaseDate]`, releaseDate.toISOString().split('T')[0]);
      
      if (video.mediaType === 'series') {
        formData.append(`videos[${index}][season]`, video.season?.toString() || '');
        formData.append(`videos[${index}][chapter]`, video.chapter?.toString() || '');
        formData.append(`videos[${index}][seriesName]`, video.seriesName || '');
        formData.append(`videos[${index}][seriesDescription]`, video.seriesDescription || '');
        const seriesReleaseDate = video.seriesReleaseDate instanceof Date ? video.seriesReleaseDate : new Date();
        formData.append(`videos[${index}][seriesReleaseDate]`, seriesReleaseDate.toISOString().split('T')[0]);
      }
    });
  
    try {
      const response = await fetch(`${this.getServerUrl()}/media/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.getToken()}`
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error:', response.status, errorText);
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload exception:', error);
      throw error;
    }
  }
public async getVideos(): Promise<MediaResponse> {
  if(!this.getToken() || this.getServerUrl() === ''){
    return { peliculas: [], series: [], episodios: [] };
  }
  const response = await fetch(`${this.getServerUrl()}/media/`, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${this.getToken()}`
    }
  });
  return response.json();
}
  public async getSeries(): Promise<Series[]> {
    if(!this.getToken() || this.getServerUrl() === ''){
      return [];
    }
    const response = await fetch(`${this.getServerUrl()}/series/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      }
    });
    return response.json();
  }
  public async getVideoUrl(url:string){
    if(url.startsWith('/media')) //Temporal TODO
      url = url.substring(7);
    const response = await fetch(`${this.getServerUrl()}/media/${url}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      },
    }).then(res => res.blob().then(blob => URL.createObjectURL(blob)));
    return response;
  }
  public async getThumnailUrl(url:string){
    const response = await fetch(`${this.getServerUrl()}/media/${url}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      },
    }).then(res => res.blob().then(blob => URL.createObjectURL(blob)));
    return response;
  }
  public async getSerieEpisodes(id:string): Promise<any[]> {
    if(!this.getToken() || this.getServerUrl() === ''){
      return [];
    }
    const response = await fetch(`${this.getServerUrl()}/series/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      }
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
