import { TestBed } from '@angular/core/testing';

import { EventStateService } from './event-state.service';
import { EventApiService } from './event-api.service';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';

describe('EventStateService', () => {
  let service: EventStateService;

  beforeEach(() => {
    let api = jasmine.createSpyObj('EventApiService', ['cos']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: EventApiService,
          useValue: api,
        },
        DateCustomPipe,
      ],
    });
    service = TestBed.inject(EventStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
