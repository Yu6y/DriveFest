import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthStateService } from '../../features/auth/services/auth-state.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private authService = inject(AuthStateService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';
        if (error.status === 401) {
          errorMessage = 'Nieautoryzowany dostęp.';
          this.authService.logout();
        } else if (error.status === 0) {
          errorMessage = 'Serwer jest niedostępny. Spróbuj później.';
          this.router.navigate(['/error']);
        } else if (error.status === 500) {
          errorMessage = 'Server error!';
          this.router.navigate(['/error']);
        }
        console.error(errorMessage);
        return throwError(error);
      })
    );
  }
}
