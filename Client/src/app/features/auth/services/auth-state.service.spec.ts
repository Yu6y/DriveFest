import { TestBed } from '@angular/core/testing';

import { AuthStateService } from './auth-state.service';
import { AuthService } from './auth.service';

describe('AuthStateService', () => {
  let service: AuthStateService;

  beforeEach(() => {
    let api = jasmine.createSpyObj('AuthService', ['cos']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: api,
        },
      ],
    });
    service = TestBed.inject(AuthStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
