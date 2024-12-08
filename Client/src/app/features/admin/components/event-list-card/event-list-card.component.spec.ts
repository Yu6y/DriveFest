import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListCardComponent } from './event-list-card.component';

describe('EventListCardComponent', () => {
  let component: EventListCardComponent;
  let fixture: ComponentFixture<EventListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventListCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
