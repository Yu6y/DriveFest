import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListPageComponent } from './users-list-page.component';
import { AdminStateService } from '../../services/admin-state.service';

describe('UsersListPageComponent', () => {
  let component: UsersListPageComponent;
  let fixture: ComponentFixture<UsersListPageComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('AdminStateService', { getUsersData: null });
    await TestBed.configureTestingModule({
      imports: [UsersListPageComponent],
      providers: [
        {
          provide: AdminStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
