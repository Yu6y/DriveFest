import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsListComponent } from './comments-list.component';
import { EventStateService } from '../../../features/events/services/event-state.service';
import { WorkshopStateService } from '../../../features/workshops/services/workshop-state.service';

describe('CommentsListComponent', () => {
  let component: CommentsListComponent;
  let fixture: ComponentFixture<CommentsListComponent>;

  beforeEach(async () => {
    let eventApi = jasmine.createSpyObj("EventStateService", ['cos']);
    let workshopApi = jasmine.createSpyObj("WorkshopStateService", {loadComments: null});
    await TestBed.configureTestingModule({  
      imports: [CommentsListComponent],
      providers: [
        {
          provide: EventStateService,
          useValue: eventApi,
        },
        {
          provide: WorkshopStateService,
          useValue: workshopApi,
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
