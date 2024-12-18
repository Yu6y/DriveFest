import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

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

  it('should navbar title appear', () => {
    const headerTitle = fixture.debugElement.query(By.css('.navbar-brand'));

    expect(headerTitle.nativeElement.textContent).toBe('DriveFest');
  });

  it('should menu be collapsed', () => {
    expect(component.isCollapsed).toBeTrue();
  });

  it('should button click open header small screen', () => {
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(768);
    const btn = fixture.debugElement.query(By.css('button'));

    component.isCollapsed = true;
    btn.nativeElement.click();
    fixture.detectChanges();
    expect(component.isCollapsed).toBeFalse();
  });
});
