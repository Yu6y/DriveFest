import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopsListPageComponent } from './workshops-list-page.component';
import { AdminStateService } from '../../services/admin-state.service';

describe('WorkshopsListPageComponent', () => {
  let component: WorkshopsListPageComponent;
  let fixture: ComponentFixture<WorkshopsListPageComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('AdminStateService', {
      loadWorkshopsList: null,
    });
    await TestBed.configureTestingModule({
      imports: [WorkshopsListPageComponent],
      providers: [
        {
          provide: AdminStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
