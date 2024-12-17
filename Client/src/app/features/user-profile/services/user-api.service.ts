import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserProfile } from '../../../shared/models/UserProfile';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private httpClient = inject(HttpClient);
  private URL = 'https://drivefest.azurewebsites.net/api/account';

  getUser() {
    return this.httpClient.get<UserProfile>(this.URL);
  }
}
