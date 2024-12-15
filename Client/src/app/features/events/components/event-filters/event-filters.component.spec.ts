import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFiltersComponent } from './event-filters.component';
import { EventStateService } from '../../services/event-state.service';

describe('EventFiltersComponent', () => {
  let component: EventFiltersComponent;
  let fixture: ComponentFixture<EventFiltersComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj("EventStateService", {getTags: null})
    await TestBed.configureTestingModule({
      imports: [EventFiltersComponent],
      providers: [
        {
          provide: EventStateService,
          useValue: api
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
