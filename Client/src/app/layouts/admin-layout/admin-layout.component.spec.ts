import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLayoutComponent } from './admin-layout.component';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('AuthStateService', {
      isLogged: true,
    });
    let activatedRoute = jasmine.createSpy('ActivatedRoute');
    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent],
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

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be header when user logged', () => {
    component.userLogged$ = of(true);

    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('app-admin-header'));
    expect(header).toBeTruthy();
  });

  it('should not be header when user is not logged', () => {
    component.userLogged$ = of(false);

    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('app-admin-header'));
    expect(header).toBeFalsy();
  });
});
