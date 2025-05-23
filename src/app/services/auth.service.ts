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
export interface Category {
  id: number;
  icono: string | null;
  nombre: string;
  descripcion: string | null;
  cantidad: number;
}
export interface VideoProgress {
  videoId: string;
  progress: number;
}
export interface Episode {
  id: number;
  titulo: string;
  temporada: number;
  numero: number;
  duracion: number;
  descripcion: string;
  imagen: string;
  progreso: number;
}
export interface EditMedia {
  id: string;
  titulo: string;
  descripcion: string;
  fecha_estreno: string;
  categorias: string[];
  imagen: string;
}

export interface Series {
  id: number;
  episodios: Episode[];
  titulo: string;
  categorias: string[];
  descripcion: string;
  fecha_estreno: string;
  temporadas: number;
  imagen: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAdminUser: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.isAdmin();
   }

  // Devuelve la URL del servidor
  public getServerUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      const ip = environment.url || localStorage.getItem('serverIp');
      const port = environment.port || localStorage.getItem('serverPort');
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
      'Authorization': 'Token ' + token
    };
  
    try {
      const response = await fetch(`${this.getServerUrl()}/token/test`, {
        method: 'GET',
        headers: headers,
      });
  
      if (!response.ok) {
        return false;
      }
  
      const result = await response.json();
      return result === true; 
    } catch (error) {
      return false;
    }
  }
  

  // Prueba la conexión con el servidor
  public async testServer(ip: string, port: string): Promise<boolean> {
    try {
      const response = await fetch(`http://${ip}:${port}/status/`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
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
  public getHLSUrl(url: string) {
    return `${this.getServerUrl()}${url}/playlist.m3u8`;
  }
  public async uploadVideos(videos: VideoEntry[],rescale:boolean = false): Promise<any> {
    const formData = new FormData();

    videos.forEach((video, index) => {
      formData.append('rescale', rescale.toString());
      formData.append(`videos[${index}][name]`, video.name);
      formData.append(`videos[${index}][description]`, video.description || '');
      formData.append(`videos[${index}][categorias]`, JSON.stringify(video.categories || []));
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
      if (video.duration) {
        formData.append(`videos[${index}][duration]`, video.duration.toString());
      }
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
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  public async getCategories(): Promise<string[]> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return [];
    }
    const response = await fetch(`${this.getServerUrl()}/categories/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      }
    });
    const categorias = await response.json();
    return categorias.map((categoria: any) => categoria.nombre);
  }

  public async getCategoriesFull(): Promise<Category[]> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return [];
    }
    const response = await fetch(`${this.getServerUrl()}/categories/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      }
    });
    const categorias = await response.json();
    return categorias;
  }
  public async createSeries(series: Series) {
    const formData = new FormData();
    formData.append('titulo', series.titulo);
    formData.append('descripcion', series.descripcion);
    formData.append('fecha_estreno', series.fecha_estreno);
    formData.append('temporadas', series.temporadas.toString());

    // Manejar las categorías como un array JSON
    if (series.categorias && series.categorias.length > 0) {
      // Opción 1: Enviar como JSON string
      formData.append('categorias', JSON.stringify(series.categorias));

      // Opción 2: Si el backend espera múltiples valores con el mismo nombre
      // series.categorias.forEach(categoria => {
      //     formData.append('categorias', categoria.toString());
      // });
    }

    // Manejar la imagen
    if (typeof series.imagen === 'string' && series.imagen.startsWith('data:image')) {
      // Convertir base64 a blob
      const parts = series.imagen.split(';base64,');
      const imageType = parts[0].split(':')[1];
      const byteString = atob(parts[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: imageType });
      formData.append('imagen', blob, `${series.titulo.replace(/\s+/g, '-')}-thumbnail.jpg`);
    }
    else {
      throw new Error('La imagen debe ser un string base64 o un objeto File/Blob');
    }

    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`${this.getServerUrl()}/series/new/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
          // No incluir 'Content-Type' para que el navegador establezca el boundary del FormData correctamente
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => response.text());
        throw new Error(typeof errorData === 'string' ? errorData : JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  public async createCategory(name: string) {
    const formData = new FormData();
    formData.append('nombre', name);
    try {
      const response = await fetch(`${this.getServerUrl()}/categories/new/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.getToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  // Este método obtiene todos los videos (películas, series y episodios) desde el servidor
  public async getVideos(): Promise<MediaResponse> {
    // Verifica si hay un token y una URL del servidor configurados
    if (!this.getToken() || this.getServerUrl() === '') {
      return { peliculas: [], series: [], episodios: [] }; // Devuelve un objeto vacío si no hay token o URL
    }

    // Realiza una solicitud GET al endpoint de medios
    const response = await fetch(`${this.getServerUrl()}/media/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.getToken()}` // Incluye el token en los encabezados
      }
    });

    const videos = await response.json(); // Convierte la respuesta en JSON

    // Procesa las miniaturas (thumbnails) de los videos en paralelo
    const processThumbnails = (videos: any[]) => {
      return Promise.all(
        videos.map(async (video) => {
          video.imagen = video.imagen.replace('/media/', ''); // Ajusta la ruta de la imagen
          video.imagen = await this.getThumnailUrl(video.imagen); // Obtiene la URL de la miniatura
          return video;
        })
      );
    };

    // Procesa las miniaturas de películas, series y episodios en paralelo
    await Promise.all([
      processThumbnails(videos.peliculas),
      processThumbnails(videos.series),
      processThumbnails(videos.episodios)
    ]);

    return videos; // Devuelve los videos procesados
  }
  public async getSeries(): Promise<Series[]> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return [];
    }
    const response = await fetch(`${this.getServerUrl()}/series/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      }
    });
    var series = await response.json();
    await Promise.all(series.map(async (serie: any) => {
      if (serie.imagen) {
        serie.imagen = await this.getThumnailUrl(serie.imagen.replace('/media/', ''));
      }
      if (serie.episodios) {
        serie.episodios = serie.episodios.map((episodio: any) => {
          episodio.imagen = episodio.imagen.replace('/media/', '');
          return episodio;
        });
      }
    }
    ));
    return series;
  }
  public async getMovies(): Promise<any[]> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return [];
    }
    const response = await fetch(`${this.getServerUrl()}/movies/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      }
    });
    var movies = await response.json();
    await Promise.all(movies.map(async (movie: any) => {
      if (movie.imagen) {
        movie.imagen = await this.getThumnailUrl(movie.imagen.replace('/media/', ''));
      }
      if (movie.video) {
        movie.video = await this.getHLSUrl(movie.video.replace('/media/', '/'));
      }
      movie.categorias = movie.categorias.map((categoria: any) => categoria.nombre);
    }));
    return movies;
  }
  public async getThumnailUrl(url: string) {
    if(!this.getToken() || this.getServerUrl() === '') {
      return '';
    }
    if(!url || url === '') {
      return '';
    }
    const response = await fetch(`${this.getServerUrl()}/get-signed-url/${url}`, {
      method: 'GET',
    }).then(res => res.json());
    return `${this.getServerUrl()}${response.signed_url}`;
  }
  public async getSerieEpisodes(id: string): Promise<any[]> {
    if (!this.getToken() || this.getServerUrl() === '') {
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
  public async getMovie(id: string): Promise<any> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return {};
    }
    const response = await fetch(`${this.getServerUrl()}/movies/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      }
    });
    var movie = await response.json();
    if (movie.imagen) {
      movie.imagen = await this.getThumnailUrl(movie.imagen.replace('/media/', ''));
    }
    if (movie.video) {
      movie.video = await this.getHLSUrl(movie.video.replace('/media/', '/'));
    }
    return movie;
  }
  public async getSerie(id: string): Promise<any> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return {};
    }

    try {
      const response = await fetch(`${this.getServerUrl()}/series/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.getToken()}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const serie = await response.json();

      // Procesar la imagen de la serie
      if (serie.imagen) {
        serie.imagen = await this.getThumnailUrl(serie.imagen.replace('/media/', ''));
      }

      // Procesar episodios si exsiten
      if (serie.episodios && Array.isArray(serie.episodios)) {
        serie.episodios = await Promise.all(serie.episodios.map(async (episodio: any) => {
          try {
            // Procesar el video del episodio
            if (episodio.video) {
              episodio.video = await this.getHLSUrl(episodio.video.replace('/media/', '/'));
            }

            // Procesar la imagen del episodio
            if (episodio.imagen) {
              episodio.imagen = await this.getThumnailUrl(episodio.imagen.replace('/media/', ''));
            }

            return episodio;
          } catch (error) {
            return episodio; // Devuelve el episodio original en caso de error
          }
        }));
      } else {
        serie.episodios = [];
      }

      return serie;
    } catch (error) {
      throw error; // Devuelve error
    }
  }
  public async setMovieProgress(videoProgress: VideoProgress): Promise<boolean> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    try {
      const response = await fetch(`${this.getServerUrl()}/movies/progress/save/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.getToken()}`
        },
        body: JSON.stringify(videoProgress)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  public async setEpisodeProgress(videoProgress: VideoProgress) {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    const response = await fetch(`${this.getServerUrl()}/series/progress/save/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.getToken()}`
      },
      body: JSON.stringify(videoProgress)
    });
    
    return response.ok;
  }

  public async getMovieProgress(videoId: string) {
    if (!this.getToken() || this.getServerUrl() === '') {
      return 0;
    }
    try {
      const response = await fetch(`${this.getServerUrl()}/movies/progress/${videoId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.getToken()}`
        }
      });
      const progress = await response.json();
      return progress.progress;
    } catch (error) {
      return 0;
    }
  }

  public async getEpisodeProgress(videoId: string): Promise<number> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return 0;
    }
    try {
      const response = await fetch(`${this.getServerUrl()}/series/progress/${videoId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.getToken()}`
        }
      });
      const progress = await response.json();
      return progress.progress;
    } catch (error) {
      return 0;
    }
  }
  public async isAdmin(): Promise<boolean> {
    if (!this.getToken() || this.getServerUrl() === '') {
      this.isAdminUser = false;
      return false;
    }
    const response = await fetch(`${this.getServerUrl()}/isAdmin/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      }
    });
    const result = await response.json();
    this.isAdminUser = result;
    return result === true;
  }
  public async deleteMovie(id: string): Promise<boolean> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    const response = await fetch(`${this.getServerUrl()}/movies/delete/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      }
    });
    return response.ok;
  }

  public async deleteSeries(id: string): Promise<boolean> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    const response = await fetch(`${this.getServerUrl()}/series/delete/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      }
    });
    return response.ok;
  }
  public async editMovie(movie: EditMedia): Promise<any> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    
    const formData = new FormData();
    formData.append('titulo', movie.titulo);
    formData.append('descripcion', movie.descripcion);
    formData.append('fecha_estreno', movie.fecha_estreno);
    formData.append('categorias', JSON.stringify(movie.categorias));

    if (typeof movie.imagen === 'string' && movie.imagen.startsWith('data:image')) {
      const parts = movie.imagen.split(';base64,');
      const imageType = parts[0].split(':')[1];
      const byteString = atob(parts[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: imageType });
      formData.append('imagen', blob, `${movie.titulo.replace(/\s+/g, '-')}-thumbnail.jpg`);
    }

    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`${this.getServerUrl()}/movies/edit/${movie.id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => response.text());
        throw new Error(typeof errorData === 'string' ? errorData : JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  public async editSeries(series: EditMedia): Promise<any> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    const formData = new FormData();
    formData.append('titulo', series.titulo);
    formData.append('descripcion', series.descripcion);
    formData.append('fecha_estreno', series.fecha_estreno);
    formData.append('categorias', JSON.stringify(series.categorias));

    if (series.imagen && typeof series.imagen === 'string' && series.imagen.startsWith('data:image')) {
      const parts = series.imagen.split(';base64,');
      const imageType = parts[0].split(':')[1];
      const byteString = atob(parts[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: imageType });
      formData.append('imagen', blob, `${series.titulo.replace(/\s+/g, '-')}-thumbnail.jpg`);
    } else {
      console.warn('No se proporcionó una imagen válida para la serie.');
    }

    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`${this.getServerUrl()}/series/edit/${series.id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => response.text());
        throw new Error(typeof errorData === 'string' ? errorData : JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  public async editEpisode(episode: Episode): Promise<any> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    const formData = new FormData();
    formData.append('titulo', episode.titulo);
    formData.append('descripcion', episode.descripcion);
    formData.append('temporada', episode.temporada.toString());
    formData.append('numero', episode.numero.toString()); 
    if (typeof episode.imagen === 'string' && episode.imagen.startsWith('data:image')) {
      const parts = episode.imagen.split(';base64,');
      const imageType = parts[0].split(':')[1];
      const byteString = atob(parts[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: imageType });
      formData.append('imagen', blob, `${episode.titulo.replace(/\s+/g, '-')}-thumbnail.jpg`);
    }
    try {
      const response = await fetch(`${this.getServerUrl()}/episodes/edit/${episode.id}/`, {
        method: 'POST',
        headers: { 
          'Authorization': `Token ${this.getToken()}`
        },
        body: formData
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
public async deleteEpisode(id: string): Promise<any> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    try {
      const response = await fetch(`${this.getServerUrl()}/episodes/delete/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${this.getToken()}`
        }
      });
      return response.ok;
    } catch (error) {
      throw error;
    }
  }


  public async getAdministrators(): Promise<any[]> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return [];
    }
    const response = await fetch(`${this.getServerUrl()}/administrators/get`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.getToken()}`
      }
    });
    return response.json();
  }

  public async editUser(user: User, id: string): Promise<any> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    const formData = new FormData();
    formData.append('password', user.password);
    try {
      const response = await fetch(`${this.getServerUrl()}/users/edit/${id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.getToken()}`
        },
        body: formData
      });
      return response.ok;
    } catch (error) {
      throw error;
    }
  }
  public async editCategory(id: string, name: string): Promise<any> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    const formData = new FormData();
    formData.append('nombre', name);
    try {
      const response = await fetch(`${this.getServerUrl()}/categories/edit/${id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.getToken()}`
        },
        body: formData
      });
      return response.ok;
    } catch (error) {
      throw error;
    }
  }
  public async deleteCategory(id: string): Promise<any> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    try {
      const response = await fetch(`${this.getServerUrl()}/categories/delete/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${this.getToken()}`
        }
      });
      return response.ok;
    } catch (error) {
      throw error;
    }
  }
  public async deleteUser(id: string): Promise<any> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    try {
      const response = await fetch(`${this.getServerUrl()}/users/delete/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${this.getToken()}`
        }
      });
      return response.ok;
    } catch (error) {
      throw error;
    }
  }
  public async createAdmin(user: User): Promise<any> {
    if (!this.getToken() || this.getServerUrl() === '') {
      return false;
    }
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('password', user.password);
    try {
      const response = await fetch(`${this.getServerUrl()}/administrators/new/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.getToken()}`
        },
        body: formData
      });
      return response.ok;
    } catch (error) {
      throw error;
    }
  }
}