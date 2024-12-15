import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLayoutComponent } from './admin-layout.component';
import { AuthStateService } from '../../features/auth/services/auth-state.service';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('AuthStateService', {
      isLogged: true, 
    });

    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent],
      providers: [
        {
          provide: AuthStateService,
          useValue: api,
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
