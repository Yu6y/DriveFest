import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLayoutComponent } from './user-layout.component';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

describe('UserLayoutComponent', () => {
  let component: UserLayoutComponent;
  let fixture: ComponentFixture<UserLayoutComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('AuthStateService', { isLogged: null });
    let activatedRoute = jasmine.createSpy('ActivatedRoute');
    await TestBed.configureTestingModule({
      imports: [UserLayoutComponent],
      providers: [
        {
          provide: AuthStateService,
          useValue: api,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be header when user logged', () => {
    component.userLogged$ = of(true);

    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('app-header'));
    expect(header).toBeTruthy();
  });

  it('should not be header when user is not logged', () => {
    component.userLogged$ = of(false);

    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('app-header'));
    expect(header).toBeFalsy();
  });
});
