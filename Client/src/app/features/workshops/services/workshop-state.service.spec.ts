import { TestBed } from '@angular/core/testing';

import { WorkshopStateService } from './workshop-state.service';

describe('WorkshopStateService', () => {
  let service: WorkshopStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkshopStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
