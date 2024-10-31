import { TestBed } from '@angular/core/testing';

import { RegistryApiService } from './registry-api.service';

describe('RegistryApiService', () => {
  let service: RegistryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
