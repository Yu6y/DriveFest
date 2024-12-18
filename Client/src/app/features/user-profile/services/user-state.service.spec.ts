import { TestBed } from '@angular/core/testing';

import { UserStateService } from './user-state.service';
import { UserApiService } from './user-api.service';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { UserProfile } from '../../../shared/models/UserProfile';
import { of } from 'rxjs';

describe('UserStateService', () => {
  let service: UserStateService;
  let api: jasmine.SpyObj<any>;
  beforeEach(() => {
    api = jasmine.createSpyObj('UserApiService', ['getUser']);
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

  it('should get data', () => {
    const data: UserProfile = {
      id: 0,
      email: 'email',
      username: 'username',
      followedEvent: null,
      userPic: '',
    };

    api.getUser.and.returnValue(of(data));

    service.getUser();

    service.user$.subscribe((res) => {
      expect(res.state).toBe('success');
      if (res.state === 'success') {
        expect(res.data.id).toBe(0);
        expect(res.data.email).toBe('email');
        expect(res.data.username).toBe('username');
        expect(res.data.followedEvent).toBeNull();
        expect(res.data.userPic).toBe('');
      }
    });
  });
});
