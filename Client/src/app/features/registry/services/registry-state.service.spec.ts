import { TestBed } from '@angular/core/testing';

import { RegistryStateService } from './registry-state.service';
import { RegistryApiService } from './registry-api.service';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';

describe('RegistryStateService', () => {
  let service: RegistryStateService;

  beforeEach(() => {
    let api = jasmine.createSpyObj('RegistryApiService', ['cos']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RegistryApiService,
          useValue: api,
        },
        DateCustomPipe,
      ],
    });
    service = TestBed.inject(RegistryStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
