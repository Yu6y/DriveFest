import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFiltersComponent } from './event-filters.component';
import { EventStateService } from '../../services/event-state.service';
import { Tag } from '../../../../shared/models/Tag';
import { of } from 'rxjs';

describe('EventFiltersComponent', () => {
  let component: EventFiltersComponent;
  let fixture: ComponentFixture<EventFiltersComponent>;

  beforeEach(async () => {
    let mockStateService: any;
    const mockTags: Tag[] = [];

    mockStateService = {
      getTags: jasmine.createSpy('getTags').and.returnValue(of(mockTags)),
    };

    await TestBed.configureTestingModule({
      imports: [EventFiltersComponent],
      providers: [
        {
          provide: EventStateService,
          useValue: mockStateService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change voiviodeships', () => {
    component.selectedVoivodeships = [];
    component.voivChange('Mazowieckie');
    component.voivChange('Zachodnio-pomorskie');
    component.voivChange('Zachodnio-pomorskie');

    fixture.detectChanges();

    expect(component.selectedVoivodeships.length).toBe(1);
  });
});
