import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopsListPageComponent } from './workshops-list-page.component';

describe('WorkshopsListPageComponent', () => {
  let component: WorkshopsListPageComponent;
  let fixture: ComponentFixture<WorkshopsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopsListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
