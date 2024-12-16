import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLayoutComponent } from './user-layout.component';
import { AuthStateService } from '../../features/auth/services/auth-state.service';

describe('UserLayoutComponent', () => {
  let component: UserLayoutComponent;
  let fixture: ComponentFixture<UserLayoutComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('AuthStateService', { isLogged: null });
    await TestBed.configureTestingModule({
      imports: [UserLayoutComponent],
      providers: [
        {
          provide: AuthStateService,
          useValue: api,
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
});
