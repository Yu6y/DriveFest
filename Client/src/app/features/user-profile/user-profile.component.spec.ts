import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';
import { AuthStateService } from '../auth/services/auth-state.service';
import { UserStateService } from './services/user-state.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('AuthStateService', ['']);
    let userApi = jasmine.createSpyObj('UserStateService', ['getUser']);
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [
        {
          provide: AuthStateService,
          useValue: api,
        },
        {
          provide: UserStateService,
          useValue: userApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
