import { catchError, map, Observable, of, startWith, tap } from 'rxjs';
import { LoadingState } from './models/LoadingState';

export function toLoadingState<T>(
  source$: Observable<T>
): Observable<LoadingState<T>> {
  console.log('crete state');
  return source$.pipe(
    tap(() => console.log('Ładowanie danych...')),
    map((data) => {
      console.log('Dane załadowane pomyślnie:', data);
      return { state: 'success' as const, data };
    }),
    catchError((error) => {
      console.error('Wystąpił błąd:', error);
      return of({ state: 'error' as const, error });
    }),
    startWith({ state: 'loading' as const })
  );
}
