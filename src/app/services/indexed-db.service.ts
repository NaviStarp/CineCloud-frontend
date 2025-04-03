import { Injectable } from '@angular/core';

export interface VideoEntry {
  id: string;
  name: string;
  description: string | null;
  videoBlob: ArrayBuffer; // Cambiado a ArrayBuffer para ser consistente
  videoMime: string;
  thumbnail: string;
  mediaType: string;
  releaseDate: Date;
  chapter: number | null;
  season: number | null;
  seriesId: number | null;
  seriesName: string | null;
  seriesDescription: string | null;
  seriesReleaseDate: Date | null;
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbName = 'CineCloud';
  private storeName = 'videos';
  private db: IDBDatabase | null = null;

  constructor() {
    // No abrimos la base de datos en el constructor
  }

  // Método para abrir la base de datos
  private async openDatabase(): Promise<void> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      console.warn('IndexedDB no está disponible en este entorno');
      return;
    }

    if (this.db) return; // Si la base de datos ya está abierta, no hacemos nada

    const request = indexedDB.open(this.dbName, 1);

    return new Promise((resolve, reject) => {
      request.onerror = (event) => reject((event.target as IDBRequest).error);
      request.onsuccess = (event) => {
        this.db = (event.target as IDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  // Guardar un video en IndexedDB usando FileReader y la estructura de VideoEntry
  async saveVideo(file: File): Promise<void> {
    await this.openDatabase();

    if (!this.db) {
      return Promise.reject('Base de datos no abierta');
    }

    // Primero obtenemos la miniatura
    let thumbnail = '';
    try {
      thumbnail = await this.extractThumbnail(file);
    } catch (error) {
      console.warn('No se pudo extraer la miniatura:', error);
    }

    // Ahora leemos el archivo como ArrayBuffer
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        if (!event.target?.result || !(event.target.result instanceof ArrayBuffer)) {
          return reject('Error al leer el archivo como ArrayBuffer');
        }
        
        const videoArrayBuffer = event.target.result;
        
        // Construir el objeto VideoEntry
        const video: VideoEntry = {
          id: file.name, // Usamos el nombre del archivo como ID
          name: file.name,
          description: null,
          videoBlob: videoArrayBuffer, // Guardamos como ArrayBuffer
          videoMime: file.type,
          thumbnail: thumbnail,
          mediaType: 'Pelicula',
          releaseDate: new Date(),
          chapter: null,
          season: null,
          seriesId: null,
          seriesName: null,
          seriesDescription: null,
          seriesReleaseDate: null,
        };

        try {
          const transaction = this.db!.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const request = store.put(video);
          
          request.onsuccess = () => {
            console.log('Video guardado correctamente');
            resolve();
          };
          
          request.onerror = (error) => {
            console.error('Error al guardar en IndexedDB:', error);
            reject(error);
          };
        } catch (error) {
          console.error('Error en la transacción:', error);
          reject(error);
        }
      };

      fileReader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
        reject(error);
      };

      fileReader.readAsArrayBuffer(file);
    });
  }

  // Recuperar un video desde IndexedDB y devolverlo como URL de objeto
  async getVideo(videoId: string): Promise<string | null> {
    await this.openDatabase();

    if (!this.db) {
      return Promise.reject('Base de datos no abierta');
    }

    const transaction = this.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const request = store.get(videoId);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const video: VideoEntry = (event.target as IDBRequest).result;
        
        if (!video) {
          console.log('Video no encontrado:', videoId);
          resolve(null);
          return;
        }
        
        try {
          // Asegurarse de que tenemos un tipo MIME válido para video
          const mimeType = video.videoMime || 'video/mp4';
          
          // Crear un Blob con el ArrayBuffer
          const videoBlob = new Blob([video.videoBlob], { type: mimeType });
          
          // Crear una URL de objeto para el Blob
          const blobUrl = URL.createObjectURL(videoBlob);
          console.log('Video URL creada correctamente:', blobUrl);
          resolve(blobUrl);
        } catch (error) {
          console.error('Error al procesar el video:', error);
          reject(error);
        }
      };

      request.onerror = (event) => {
        console.error('Error al obtener el video:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  extractThumbnail(videoBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.muted = true; // Para evitar problemas con la reproducción automática
      video.playsInline = true;
      const objectUrl = URL.createObjectURL(videoBlob);
      video.src = objectUrl;
      
      // Configurar un timeout para evitar esperas infinitas
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        reject('Timeout al cargar el video para la miniatura');
      }, 10000); // 10 segundos
      
      video.onloadedmetadata = () => {
        video.currentTime = 1; // mover el video a 1 segundo
      };
      
      video.ontimeupdate = () => {
        if (video.currentTime >= 1) {
          clearTimeout(timeout);
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 240;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.7);
              URL.revokeObjectURL(objectUrl); // Liberar la URL del objeto
              resolve(thumbnailDataUrl);
            } else {
              URL.revokeObjectURL(objectUrl);
              reject('No se pudo obtener el contexto 2D del canvas');
            }
            
            // Detener eventos y liberar recursos
            video.ontimeupdate = null;
            video.onloadedmetadata = null;
            video.onerror = null;
          } catch (error) {
            URL.revokeObjectURL(objectUrl);
            reject(error);
          }
        }
      };
      
      video.onerror = (error) => {
        clearTimeout(timeout);
        URL.revokeObjectURL(objectUrl);
        reject(error);
      };
      
      // Forzar la carga
      video.load();
    });
  }

  // Obtener todos los videos
  async getVideos(): Promise<VideoEntry[]> {
    await this.openDatabase();

    if (!this.db) {
      return Promise.reject('Base de datos no abierta');
    }

    const transaction = this.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const videos: VideoEntry[] = (event.target as IDBRequest).result;
        resolve(videos);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  // Actualizar un video existente usando la interfaz VideoEntry
  async updateVideo(video: VideoEntry): Promise<any> {
    await this.openDatabase();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Base de datos no abierta');
      }
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(video);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Agregar un nuevo video (asegurándose de que no exista uno con el mismo ID)
  async addVideo(video: VideoEntry): Promise<any> {
    await this.openDatabase();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Base de datos no abierta');
      }
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(video);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Eliminar un video por su ID
  async deleteVideo(videoId: string): Promise<void> {
    await this.openDatabase();
    
    if (!this.db) {
      return Promise.reject('Base de datos no abierta');
    }
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Base de datos no abierta');
      }
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(videoId);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}