import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDescComponent } from './event-desc.component';

describe('EventDescComponent', () => {
  let component: EventDescComponent;
  let fixture: ComponentFixture<EventDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDescComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
