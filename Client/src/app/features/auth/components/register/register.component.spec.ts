import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthStateService } from '../../services/auth-state.service';
import { of, BehaviorSubject } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    const mockRegisterState$ = new BehaviorSubject({
      state: 'idle'
    });

    const mockAuthService = jasmine.createSpyObj('AuthStateService', ['registerUser'], {
      registerState$: mockRegisterState$.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        {
          provide: AuthStateService,
          useValue: mockAuthService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
