import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

export const adminGuard: CanActivateFn = async (route, state) => {
  const platformId = inject(PLATFORM_ID);
   if (!isPlatformBrowser(platformId)) {
    return true;
  }
  const auth = inject(AuthService);
  const router = inject(Router);
  try {
    const isAdmin = await auth.isAdmin();
    console.log('isAdmin', isAdmin);
    if (isAdmin) {
      return true;
    } else {
      router.navigate(['/not-authorized']);
      return false;
    }
  } catch (error) {
    router.navigate(['/not-authorized']);
    return false;
  }
};
