import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { AuthStateService } from '../auth/services/auth-state.service';
import { UserStateService } from './services/user-state.service';
import { UserProfile } from '../../shared/models/UserProfile';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

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

  it('should display data', () => {
    const data: UserProfile = {
      id: 0,
      email: 'mail@mail',
      username: 'username',
      followedEvent: null,
      userPic: '',
    };

    component.user$ = of({ state: 'success', data: data });

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.username-text')).nativeElement
        .textContent
    ).toBe('username');

    expect(
      fixture.debugElement.query(By.css('.mail-text')).nativeElement.textContent
    ).toBe('mail@mail');
  });
});
