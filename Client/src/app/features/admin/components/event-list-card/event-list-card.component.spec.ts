import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListCardComponent } from './event-list-card.component';
import { AdminEvent } from '../../../../shared/models/AdminEvent';

describe('EventListCardComponent', () => {
  let component: EventListCardComponent;
  let fixture: ComponentFixture<EventListCardComponent>;

  beforeEach(async () => {
    let mockAdminEvent: AdminEvent = { id: 0, name: '', date: '' };

    await TestBed.configureTestingModule({
      imports: [EventListCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventListCardComponent);
    component = fixture.componentInstance;
    component.value = mockAdminEvent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
