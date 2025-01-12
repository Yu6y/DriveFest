import { fakeAsync, TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { SuccessLogin } from '../../../shared/models/SuccessLogin';
import { LoginCredentials } from '../models/LoginCredentials';
import { UserRole } from '../../../shared/models/UserRole';

describe('AuthService', () => {
  let service: AuthService;
  let testingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    testingController = TestBed.inject(HttpTestingController);
  });

  const url = 'http://localhost:5253/api/account';

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get error', () => {
    const error = { status: 500, statusText: 'Internal Server Error' };

    service.getUserRole().subscribe({
      next: () => fail("Shouldn't appear"),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      },
    });

    const req = testingController.expectOne(`${url}/role`);
    expect(req.request.method).toBe('GET');

    req.flush(null, error);
  });

  it('should login user', () => {
    const data: SuccessLogin = {
      jwt: 'jwt',
      isAdmin: true,
    };

    const cred: LoginCredentials = {
      email: 'mail',
      password: 'pass',
    };

    service.loginUser(cred).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.isAdmin).toBeTrue();
    });
    const req = testingController.expectOne(`${url}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(data);
  });

  it('should gete user role', fakeAsync(() => {
    const data: UserRole = {
      isAdmin: true,
    };

    service.getUserRole().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.isAdmin).toBeTrue();
    });
    const req = testingController.expectOne(`${url}/role`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  }));
});
