import { TestBed } from '@angular/core/testing';

import { WorkshopApiService } from './workshop-api.service';

describe('WorkshopApiService', () => {
  let service: WorkshopApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkshopApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
