import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, delay, of, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginCredentials } from '../models/LoginCredentials';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterCredentials } from '../models/RegisterCredentials';
import { LoadingState } from '../../../shared/models/LoadingState';
import { RegisterError, RegisterState } from '../models/RegistrationState';
import { ToastService } from '../../../shared/services/toast.service';
import { SuccessLogin } from '../../../shared/models/SuccessLogin';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private userLoggedSubject$ = new BehaviorSubject<boolean>(false);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private loginStateSubject$ = new BehaviorSubject<LoadingState<SuccessLogin>>({
    state: 'idle',
  });
  private registerStateSubject$ = new BehaviorSubject<RegisterState<string>>({
    state: 'idle',
  });
  private isAdmin = new BehaviorSubject<boolean | null>(null);

  userLogged$ = this.userLoggedSubject$.asObservable();
  userAdmin$ = this.isAdmin.asObservable();
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
            .pipe(delay(1000))
            .subscribe((res) => {
              this.loginStateSubject$.next({ state: 'success', data: res });
              localStorage.setItem('auth_token', res.jwt);
              console.log(res);
              this.userLoggedSubject$.next(true);
              this.toastService.showToast(
                'Logowanie przebiegło pomyślnie.',
                'success'
              );
              this.isAdmin.next(res.isAdmin);
              setTimeout(() => this.router.navigate(['/home']), 2000);
            });
        }),
        catchError((error: HttpErrorResponse) => {
          this.toastService.showToast('Nie udało się zalogować.', 'error');
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
    const form = new FormData();
    form.append('Email', registerCredentials.email);
    form.append('Username', registerCredentials.username);
    form.append('Password', registerCredentials.password);
    form.append(
      'PhotoURL',
      registerCredentials.photoURL ? registerCredentials.photoURL : ''
    );

    this.registerStateSubject$.next({ state: 'loading' });
    this.authService
      .registerUser(form)
      .pipe(
        tap((response) => {
          of(response as { success: string })
            .pipe(delay(1000))
            .subscribe((res) => {
              this.registerStateSubject$.next({
                state: 'success',
                data: res.success,
              });
              console.log(res);
              this.toastService.showToast(
                'Rejestracja przebiegła pomyślnie.',
                'success'
              );
              setTimeout(() => this.router.navigate(['/login']), 2000);
            });
        }),
        catchError((error: HttpErrorResponse) => {
          this.toastService.showToast('Rejestracja nie powiodła się.', 'error');
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

  getUserRole() {
    console.log(this.isAuthenticated());
    if (this.isAuthenticated()) {
      this.authService
        .getUserRole()
        .pipe(
          tap((res) => {
            this.isAdmin.next(res.isAdmin);
            console.log(res);
          }),
          catchError((err) => {
            console.log(err);
            return throwError(err);
          })
        )
        .subscribe();
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.userLoggedSubject$.next(false);
  }
}
