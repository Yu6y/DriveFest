import { TestBed } from '@angular/core/testing';

import { WorkshopApiService } from './workshop-api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('WorkshopApiService', () => {
  let service: WorkshopApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WorkshopApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
