import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service'; 

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = await authService.loggedIn();

  return isLoggedIn ? true : router.createUrlTree(['/login']);
};
