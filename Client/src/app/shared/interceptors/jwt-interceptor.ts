import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem('auth_token');
    if (token) {
      req = req.clone({
        headers: req.headers
          .set('Authorization', `Bearer ${token}`)
          .set(
            'Cache-Control',
            'no-cache, no-store, must-revalidate, post-check=0, pre-check=0'
          )
          .set('Pragma', 'no-cache')
          .set('Expires', '0'),
      });
    }
    return next.handle(req);
  }
}
