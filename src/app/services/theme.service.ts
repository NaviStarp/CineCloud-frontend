import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum Themes {
  PURPLE = 'Morado',
  RED = 'Rojo',
  ORANGE = 'Naranja',
  GREEN = 'Verde',
  BLUE = 'Azul'
}

// Interfaz para la configuración de colores de un tema
interface ThemeColors {
  [key: string]: string;
}

// Clave para almacenar el tema en el localStorage
const THEME_STORAGE_KEY = 'cinecloud-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Tema por defecto
  private readonly DEFAULT_THEME = Themes.PURPLE;
  
  // Subject para manejar la reactividad del tema actual
  private currentThemeSubject = new BehaviorSubject<Themes>(this.getInitialTheme());
  
  // Observable para que los componentes puedan suscribirse al tema actual
  currentTheme$: Observable<Themes> = this.currentThemeSubject.asObservable();

  // Definición de colores para cada tema
  themeColors: Record<Themes, ThemeColors> = {
    [Themes.PURPLE]: {
      '--color-primary-50': '#f5f3ff',
      '--color-primary-100': '#ede9fe',
      '--color-primary-200': '#ddd6fe',
      '--color-primary-300': '#c4b5fd',
      '--color-primary-400': '#a78bfa',
      '--color-primary-500': '#8b5cf6',
      '--color-primary-600': '#7c3aed',
      '--color-primary-700': '#6d28d9',
      '--color-primary-800': '#5b21b6',
      '--color-primary-900': '#4c1d95',
      '--color-primary-500-rgb': '139, 92, 246',
      '--color-accent-200': '#fecdd3',
      '--color-accent-300': '#fda4af',
      '--color-accent-400': '#fb7185',
      '--color-accent-500': '#f43f5e',
      '--color-accent-600': '#e11d48',
      '--color-accent-700': '#be123c',
      '--color-accent-800': '#9f1239',
      '--color-accent-900': '#881337',
      // '--color-accent-100': '#e0f7f9',
      // '--color-accent-200': '#b2ebf2',
      // '--color-accent-300': '#80deea',
      // '--color-accent-400': '#4dd0e1',
      // '--color-accent-500': '#26c6da',
      // '--color-accent-600': '#00bcd4',
      // '--color-accent-700': '#00acc1',
      // '--color-accent-800': '#0097a7',
      // '--color-accent-900': '#00838f',

    },
    [Themes.RED]: {
      '--color-primary-50': '#fef2f2',
      '--color-primary-100': '#fee2e2',
      '--color-primary-200': '#fecaca',
      '--color-primary-300': '#fca5a5',
      '--color-primary-400': '#f87171',
      '--color-primary-500': '#ef4444',
      '--color-primary-600': '#dc2626',
      '--color-primary-700': '#b91c1c',
      '--color-primary-800': '#991b1b',
      '--color-primary-900': '#7f1d1d',
      '--color-primary-500-rgb': '239, 68, 68',
'--color-accent-100': '#e0e7ff',
'--color-accent-200': '#c7d2fe',
'--color-accent-300': '#a5b4fc',
'--color-accent-400': '#818cf8',
'--color-accent-500': '#6366f1',
'--color-accent-600': '#4f46e5',
'--color-accent-700': '#4338ca',
'--color-accent-800': '#3730a3',
'--color-accent-900': '#312e81',

    },
    [Themes.ORANGE]: {
      '--color-primary-50': '#fff7ed',
      '--color-primary-100': '#ffedd5',
      '--color-primary-200': '#fed7aa',
      '--color-primary-300': '#fdba74',
      '--color-primary-400': '#fb923c',
      '--color-primary-500': '#f97316',
      '--color-primary-600': '#ea580c',
      '--color-primary-700': '#c2410c',
      '--color-primary-800': '#9a3412',
      '--color-primary-900': '#7c2d12',
      '--color-primary-500-rgb': '249, 115, 22',
'--color-accent-100': '#cffafe',
'--color-accent-200': '#a5f3fc',
'--color-accent-300': '#67e8f9',
'--color-accent-400': '#22d3ee',
'--color-accent-500': '#06b6d4',
'--color-accent-600': '#0891b2',
'--color-accent-700': '#0e7490',
'--color-accent-800': '#155e75',
'--color-accent-900': '#164e63',

    },
    [Themes.GREEN]: {
      '--color-primary-50': '#f0fdf4',
      '--color-primary-100': '#dcfce7',
      '--color-primary-200': '#bbf7d0',
      '--color-primary-300': '#86efac',
      '--color-primary-400': '#4ade80',
      '--color-primary-500': '#22c55e',
      '--color-primary-600': '#16a34a',
      '--color-primary-700': '#15803d',
      '--color-primary-800': '#166534',
      '--color-primary-900': '#14532d',
      '--color-primary-500-rgb': '34, 197, 94',
'--color-accent-100': '#ede9fe',
'--color-accent-200': '#ddd6fe',
'--color-accent-300': '#c4b5fd',
'--color-accent-400': '#a78bfa',
'--color-accent-500': '#8b5cf6',
'--color-accent-600': '#7c3aed',
'--color-accent-700': '#6d28d9',
'--color-accent-800': '#5b21b6',
'--color-accent-900': '#4c1d95',

    },
    [Themes.BLUE]: {
      '--color-primary-50': '#eff6ff',
      '--color-primary-100': '#dbeafe',
      '--color-primary-200': '#bfdbfe',
      '--color-primary-300': '#93c5fd',
      '--color-primary-400': '#60a5fa',
      '--color-primary-500': '#3b82f6',
      '--color-primary-600': '#2563eb',
      '--color-primary-700': '#1d4ed8',
      '--color-primary-800': '#1e40af',
      '--color-primary-900': '#1e3a8a',
      '--color-primary-500-rgb': '59, 130, 246',
'--color-accent-100': '#ffe4e6',
'--color-accent-200': '#fecdd3',
'--color-accent-300': '#fda4af',
'--color-accent-400': '#fb7185',
'--color-accent-500': '#f43f5e',
'--color-accent-600': '#e11d48',
'--color-accent-700': '#be123c',
'--color-accent-800': '#9f1239',
'--color-accent-900': '#881337',

    }
  };

  constructor() {
    // Aplica el tema inicial al cargar el servicio
    this.setTheme(this.currentThemeSubject.value);
  }

  /**
   * Obtiene el tema inicial desde el localStorage o usa el tema por defecto
   */
  private getInitialTheme(): Themes {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      
      // Verifica si el tema guardado es válido
      if (savedTheme && Object.values(Themes).includes(savedTheme as Themes)) {
        return savedTheme as Themes;
      }
    } catch (error) {
      console.warn('Error al acceder al localStorage:', error);
    }
    
    return this.DEFAULT_THEME;
  }

  /**
   * Obtiene el tema actual
   */
  getCurrentTheme(): Themes {
    return this.currentThemeSubject.value;
  }

  /**
   * Actualiza el tema actual en el Subject
   */
  private setCurrentTheme(theme: Themes): void {
    this.currentThemeSubject.next(theme);
    
    // Guarda el tema en el localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Error al guardar el tema en localStorage:', error);
    }
  }

  /**
   * Aplica el tema al documento
   */
  setTheme(theme: Themes): void {
    // Valida que el tema sea válido
    if (!Object.values(Themes).includes(theme)) {
      console.error(`Tema inválido proporcionado: "${theme}"`);
      theme = this.DEFAULT_THEME;
    }

    const colors = this.themeColors[theme];
    if (!colors) {
      console.error(`El tema "${theme}" no está definido en themeColors.`);
      return;
    }

    // Actualiza el tema actual
    this.setCurrentTheme(theme);
    
    // Aplica las variables CSS al documento
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  /**
   * Obtiene todos los temas disponibles
   */
  getAvailableThemes(): Array<{key: string, value: string}> {
    return Object.entries(Themes).map(([key, value]) => ({ key, value }));
  }
}
