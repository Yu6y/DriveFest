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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private router = inject(Router);
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';
        if (error.status === 401)
          // route na strone logowania
          errorMessage = 'Nieautoryzowany dostęp.';
        else if (error.status === 0) {
          errorMessage = 'Serwer jest niedostępny. Spróbuj później.';
          this.router.navigate(['/error']);
        } else if (error.status === 500) {
          errorMessage = 'Server error!';
          this.router.navigate(['/error']);
        }
        /* if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }*/
        // Handle the error as desired (e.g., show an alert, log, etc.)
        console.error(errorMessage);
        return throwError(error);
      })
    );
  }
}
