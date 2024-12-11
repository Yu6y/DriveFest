import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginCredentials } from '../models/LoginCredentials';
import { SuccessLogin } from '../../../shared/models/SuccessLogin';
import { UserRole } from '../../../shared/models/UserRole';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private URL = 'http://localhost:5253/api/account/';

  loginUser(loginCredentials: LoginCredentials) {
    return this.httpClient.post<SuccessLogin>(
      this.URL + 'login',
      loginCredentials
    );
  }

  registerUser(registerCredentials: FormData) {
    return this.httpClient.post(this.URL + 'register', registerCredentials);
  }

  getUserRole() {
    return this.httpClient.get<UserRole>(this.URL + 'role');
  }
}
