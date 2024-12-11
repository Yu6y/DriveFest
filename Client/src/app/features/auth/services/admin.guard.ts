import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthStateService } from './auth-state.service';
import { filter, map, tap } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthStateService);
  console.log('guard');
  return authService.userAdmin$.pipe(
    filter((isAdmin) => isAdmin !== null),
    tap((isAdmin) => {
      if (!isAdmin) {
        authService.logout();
      }
    }),
    map((isAdmin) => isAdmin)
  );
};
