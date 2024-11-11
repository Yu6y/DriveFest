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

  loginUser(loginCredentials: LoginCredentials) {
    return this.httpClient.post(this.URL + 'login', loginCredentials, {
      responseType: 'text',
    });
  }

  registerUser(registerCredentials: FormData) {
    return this.httpClient.post(this.URL + 'register', registerCredentials);
  }
}
