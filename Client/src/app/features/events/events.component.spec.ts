import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsComponent } from './events.component';
import { EventStateService } from './services/event-state.service';
import { WorkshopStateService } from '../workshops/services/workshop-state.service';
import { Tag } from '../../shared/models/Tag';
import { of } from 'rxjs';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  beforeEach(async () => {
    const mockTags: Tag[] = [];

    let mockState = {
      getTags: jasmine.createSpy('getTags').and.returnValue(of(mockTags)),
      startEventList: jasmine.createSpy('startEventList'),
      loadEvents: jasmine.createSpy('loadEvents'),
    };
    let workshopApi = jasmine.createSpyObj('WorkshopStateService', ['']);
    await TestBed.configureTestingModule({
      imports: [EventsComponent],
      providers: [
        {
          provide: EventStateService,
          useValue: mockState,
        },
        {
          provide: WorkshopStateService,
          useValue: workshopApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
