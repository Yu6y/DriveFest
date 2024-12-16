import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavListComponent } from './fav-list.component';
import { EventStateService } from '../../services/event-state.service';
import { WorkshopStateService } from '../../../workshops/services/workshop-state.service';

describe('FavListComponent', () => {
  let component: FavListComponent;
  let fixture: ComponentFixture<FavListComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('EventStateService', {
      startEventList: null,
      loadFavEvents: null,
    });
    let workshopApi = jasmine.createSpyObj('WorkshopStateService', ['cos']);
    await TestBed.configureTestingModule({
      imports: [FavListComponent],
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

    fixture = TestBed.createComponent(FavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
