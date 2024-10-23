import { catchError, map, Observable, of, startWith } from 'rxjs';
import { RegisterError, RegisterState } from './models/RegistrationState';
import { HttpErrorResponse } from '@angular/common/http';

export function registerLoadingState<T>(
  source$: Observable<T>
): Observable<RegisterState<T>> {
  return source$.pipe(
    map((data) => ({ state: 'success' as const, data })),
    catchError((error: HttpErrorResponse) =>
      of({
        state: 'error' as const,
        error: error.error.errors as RegisterError,
      })
    ),
    startWith({ state: 'loading' as const })
  );
}
