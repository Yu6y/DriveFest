import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginCredentials } from '../models/LoginCredentials';
import { Router } from '@angular/router';
import { RegisterCredentials } from '../models/RegisterCredentials';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private URL = 'http://localhost:5253/api/account/';
  private userLoggedSubject$ = new BehaviorSubject<boolean>(false);
  private router = inject(Router);
  userLogged$ = this.userLoggedSubject$.asObservable();

  loginUser(loginCredentials: LoginCredentials) {
    return this.httpClient
      .post(this.URL + 'login', loginCredentials, {
        responseType: 'text',
      })
      .subscribe({
        next: (response) => {
          localStorage.setItem('auth_token', response);
          this.userLoggedSubject$.next(true);
          this.router.navigate(['/home']);
          console.log(response);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
        },
      });
  }

  registerUser(registerCredentials: RegisterCredentials) {
    return this.httpClient.post(this.URL + 'register', registerCredentials);
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem('auth_token')) return true;
    return false;
  }

  isLogged() {
    if (this.isAuthenticated()) this.userLoggedSubject$.next(true);
    else this.userLoggedSubject$.next(false);
  }
}
