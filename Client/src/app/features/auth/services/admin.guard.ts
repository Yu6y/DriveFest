import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';
import { map, tap } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthStateService);
  const router = inject(Router);

  return authService.userAdmin$.pipe(
    tap((isAdmin) => {
      if (!isAdmin) {
        router.navigate(['/login']);
      }
    }),
    map((isAdmin) => isAdmin)
  );
};
