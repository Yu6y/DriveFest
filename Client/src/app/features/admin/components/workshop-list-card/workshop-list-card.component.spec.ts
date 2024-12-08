import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopListCardComponent } from './workshop-list-card.component';

describe('WorkshopListCardComponent', () => {
  let component: WorkshopListCardComponent;
  let fixture: ComponentFixture<WorkshopListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopListCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
