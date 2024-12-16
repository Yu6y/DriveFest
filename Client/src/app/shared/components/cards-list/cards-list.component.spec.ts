import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsListComponent } from './cards-list.component';
import { EventStateService } from '../../../features/events/services/event-state.service';
import { WorkshopStateService } from '../../../features/workshops/services/workshop-state.service';

describe('CardsListComponent', () => {
  let component: CardsListComponent;
  let fixture: ComponentFixture<CardsListComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('EventStateService', ['']);
    let workshopApi = jasmine.createSpyObj('WorkshopStateService', ['']);
    await TestBed.configureTestingModule({
      imports: [CardsListComponent],
      providers: [
        {
          provide: EventStateService,
          useValue: api,
        },
        {
          provide: WorkshopStateService,
          useValue: workshopApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
