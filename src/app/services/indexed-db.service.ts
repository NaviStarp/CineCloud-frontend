import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbName = 'CineCloud';
  private storeName = 'videos';
  private db: IDBDatabase | null = null;

  constructor() {
    // No llamamos a openDatabase() aquí directamente
  }

  // Método para abrir la base de datos
  private async openDatabase(): Promise<void> {
    if (this.db) return; // Si la base de datos ya está abierta, no hacer nada
    const request = indexedDB.open(this.dbName, 1);

    return new Promise((resolve, reject) => {
      request.onerror = (event) => reject(event.target);
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

  // Guardar un video en IndexedDB
  async saveVideo(file: File): Promise<void> {
    await this.openDatabase(); // Esperar a que la base de datos esté abierta

    if (!this.db) {
      return Promise.reject('Base de datos no abierta');
    }

    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onload = (event) => {
        const videoData = event.target?.result;
        const transaction = this.db!.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const video = {
          id: file.name, // Usamos el nombre del archivo como ID
          name: file.name,
          type: file.type,
          data: videoData, // Almacenamos el contenido del archivo
        };

        store.put(video);

        transaction.oncomplete = () => {
          console.log('Video guardado');
          resolve();
        };

        transaction.onerror = (error) => {
          reject(error);
        };
      };

      fileReader.readAsArrayBuffer(file); // Leer el archivo como ArrayBuffer
    });
  }

  // Recuperar un video desde IndexedDB
  async getVideo(videoId: string): Promise<Blob | null> {
    await this.openDatabase(); // Esperar a que la base de datos esté abierta

    if (!this.db) {
      return Promise.reject('Base de datos no abierta');
    }

    const transaction = this.db!.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const request = store.get(videoId);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const video = (event.target as IDBRequest).result;
        if (video) {
          const videoBlob = new Blob([video.data], { type: video.type });
          resolve(videoBlob);
        } else {
          resolve(null); // Si no se encuentra el video
        }
      };

      request.onerror = (event) => {
        reject(event.target);
      };
    });
  }

  // Obtener todos los videos
  async getVideos(): Promise<File[]> {
    await this.openDatabase(); // Esperar a que la base de datos esté abierta

    if (!this.db) {
      return Promise.reject('Base de datos no abierta');
    }

    const transaction = this.db!.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const videos = (event.target as IDBRequest).result.map((video: any) => {
          const videoBlob = new Blob([video.data], { type: video.type });
          return new File([videoBlob], video.name, { type: video.type });
        });
        resolve(videos);
      };

      request.onerror = (event) => {
        reject(event.target);
      };
    });
  }
  
}
