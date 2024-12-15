import { TestBed } from '@angular/core/testing';

import { RegistryApiService } from './registry-api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('RegistryApiService', () => {
  let service: RegistryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RegistryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
