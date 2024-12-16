import { TestBed } from '@angular/core/testing';

import { AdminStateService } from './admin-state.service';
import { AdminApiService } from './admin-api.service';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { EventApiService } from '../../events/services/event-api.service';
import { WorkshopApiService } from '../../workshops/services/workshop-api.service';

describe('AdminStateService', () => {
  let service: AdminStateService;

  beforeEach(() => {
    let api = jasmine.createSpyObj('AdminApiService', ['cos']);
    let event = jasmine.createSpyObj('EventApiService', ['cos']);
    let workshop = jasmine.createSpyObj('WorkshopApiService', ['cos']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AdminApiService,
          useValue: api,
        },
        {
          provide: EventApiService,
          useValue: event,
        },
        {
          provide: WorkshopApiService,
          useValue: workshop,
        },
        DateCustomPipe,
      ],
    });
    service = TestBed.inject(AdminStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
