import { TestBed } from '@angular/core/testing';

import { WorkshopStateService } from './workshop-state.service';
import { WorkshopApiService } from './workshop-api.service';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';

describe('WorkshopStateService', () => {
  let service: WorkshopStateService;

  beforeEach(() => {
    let api = jasmine.createSpyObj('WorkshopsApiService', ['cos']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: WorkshopApiService,
          useValue: api,
        },
        DateCustomPipe,
      ],
    });
    service = TestBed.inject(WorkshopStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
