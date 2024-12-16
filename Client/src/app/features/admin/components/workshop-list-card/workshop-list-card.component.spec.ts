import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopListCardComponent } from './workshop-list-card.component';
import { AdminWorkshop } from '../../../../shared/models/AdminWorkshop';

describe('WorkshopListCardComponent', () => {
  let component: WorkshopListCardComponent;
  let fixture: ComponentFixture<WorkshopListCardComponent>;

  beforeEach(async () => {
    const val: AdminWorkshop = {
      id: 0,
      name: '',
      location: '',
    };
    await TestBed.configureTestingModule({
      imports: [WorkshopListCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopListCardComponent);
    component = fixture.componentInstance;

    component.value = val;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
