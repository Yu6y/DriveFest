import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  delay,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';
import { LoginCredentials } from '../models/LoginCredentials';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterCredentials } from '../models/RegisterCredentials';
import { LoadingState } from '../../../shared/models/LoadingState';
import { toLoadingState } from '../../../shared/CreateState';
import { RegisterError, RegisterState } from '../models/RegistrationState';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private userLoggedSubject$ = new BehaviorSubject<boolean>(false);
  private router = inject(Router);
  private authService = inject(AuthService);
  private loginStateSubject$ = new BehaviorSubject<LoadingState<string>>({
    state: 'idle',
  });
  private registerStateSubject$ = new BehaviorSubject<RegisterState<string>>({
    state: 'idle',
  });

  userLogged$ = this.userLoggedSubject$.asObservable();

  loginState$ = this.loginStateSubject$.asObservable();
  registerState$ = this.registerStateSubject$.asObservable();

  isLogged() {
    if (this.isAuthenticated()) this.userLoggedSubject$.next(true);
    else this.userLoggedSubject$.next(false);
  }

  loginUser(loginCredentials: LoginCredentials) {
    this.loginStateSubject$.next({ state: 'loading' });
    this.authService
      .loginUser(loginCredentials)
      .pipe(
        tap((response) => {
          of(response)
            .pipe(delay(2000))
            .subscribe((res) => {
              this.loginStateSubject$.next({ state: 'success', data: res });
              localStorage.setItem('auth_token', res);
              console.log(res);
              this.userLoggedSubject$.next(true);
              setTimeout(() => this.router.navigate(['/home']), 2000);
            });
        }),
        catchError((error: HttpErrorResponse) => {
          this.loginStateSubject$.next({
            state: 'error',
            error: error.message,
          });
          return throwError(error);
        })
      )
      .subscribe();
  }

  registerUser(registerCredentials: RegisterCredentials) {
    this.registerStateSubject$.next({ state: 'loading' });
    this.authService
      .registerUser(registerCredentials)
      .pipe(
        tap((response) => {
          of(response as { success: string })
            .pipe(delay(2000))
            .subscribe((res) => {
              this.registerStateSubject$.next({
                state: 'success',
                data: res.success,
              });
              console.log(res);
              setTimeout(() => this.router.navigate(['/login']), 2000);
            });
        }),
        catchError((error: HttpErrorResponse) => {
          this.registerStateSubject$.next({
            state: 'error',
            error: error.error.errors as RegisterError,
          });
          return throwError(error);
        })
      )
      .subscribe();
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem('auth_token')) return true;
    return false;
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.clear();
    this.userLoggedSubject$.next(false);
  }
}
