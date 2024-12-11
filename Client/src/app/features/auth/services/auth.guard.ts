import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthStateService);
  const router = inject(Router);

  if (authService.isAuthenticated()) return true;
  else {
    router.navigate(['/login']);
    return false;
  }
};
