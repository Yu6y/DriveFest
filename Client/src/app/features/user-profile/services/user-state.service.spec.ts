import { TestBed } from '@angular/core/testing';

import { UserStateService } from './user-state.service';
import { UserApiService } from './user-api.service';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';

describe('UserStateService', () => {
  let service: UserStateService;

  beforeEach(() => {
    let api = jasmine.createSpyObj('UserApiService', ['cos']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserApiService,
          useValue: api,
        },
        DateCustomPipe,
      ],
    });
    service = TestBed.inject(UserStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
