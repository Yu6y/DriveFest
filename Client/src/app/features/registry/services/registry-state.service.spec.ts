import { TestBed } from '@angular/core/testing';

import { RegistryStateService } from './registry-state.service';

describe('RegistryStateService', () => {
  let service: RegistryStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistryStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
