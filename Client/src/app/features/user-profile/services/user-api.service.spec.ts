import { TestBed } from '@angular/core/testing';

import { UserApiService } from './user-api.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { UserProfile } from '../../../shared/models/UserProfile';

describe('UserApiService', () => {
  let service: UserApiService;
  let testingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserApiService);
    testingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get data', () => {
    const data: UserProfile = {
      id: 2,
      email: 'email',
      username: 'username',
      followedEvent: null,
      userPic: '',
    };

    service.getUser().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.email).toBe('email');
      expect(res.username).toBe('username');
      expect(res.followedEvent).toBeNull();
    });
    const req = testingController.expectOne(
      'http://localhost:5253/api/account'
    );
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });
});
