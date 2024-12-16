import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopsComponent } from './workshops.component';
import { WorkshopStateService } from './services/workshop-state.service';
import { EventStateService } from '../events/services/event-state.service';
import { Tag } from '../../shared/models/Tag';
import { of } from 'rxjs';

describe('WorkshopsComponent', () => {
  let component: WorkshopsComponent;
  let fixture: ComponentFixture<WorkshopsComponent>;

  beforeEach(async () => {
    const mockTags: Tag[] = [];
    let api = {
      loadWorkshops: jasmine.createSpy('loadWorkshops'),
      getTags: jasmine.createSpy('getTags').and.returnValue(of(mockTags)),
    };
    let eventApi = jasmine.createSpyObj('EventStateService', ['']);

    await TestBed.configureTestingModule({
      imports: [WorkshopsComponent],
      providers: [
        {
          provide: WorkshopStateService,
          useValue: api,
        },
        {
          provide: EventStateService,
          useValue: eventApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
