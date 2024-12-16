import { TestBed } from '@angular/core/testing';

import { AdminApiService } from './admin-api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdminApiService', () => {
  let service: AdminApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AdminApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
