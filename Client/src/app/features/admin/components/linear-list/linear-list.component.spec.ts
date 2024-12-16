import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearListComponent } from './linear-list.component';
import { AdminStateService } from '../../services/admin-state.service';

describe('EventsListComponent', () => {
  let component: LinearListComponent;
  let fixture: ComponentFixture<LinearListComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('AdminStateService', ['getUsersData']);
    await TestBed.configureTestingModule({
      imports: [LinearListComponent],
      providers: [
        {
          provide: AdminStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinearListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
