import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
export const appConfig: ApplicationConfig = {
  providers: [{ provide: APP_BASE_HREF, useValue: '/CineCloud-frontend/' },provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), provideAnimations()]
};
