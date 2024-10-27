import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopDescComponent } from './workshop-desc.component';

describe('WorkshopDescComponent', () => {
  let component: WorkshopDescComponent;
  let fixture: ComponentFixture<WorkshopDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopDescComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
