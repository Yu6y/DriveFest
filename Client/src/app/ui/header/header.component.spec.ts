import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { ActivatedRoute } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    const api = jasmine.createSpyObj('AuthStateService', ['cos'], {
      userAdmin$: null,
    });

    const activatedRoute = {
      snapshot: {
        params: {},
        queryParams: {},
      },
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
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

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
