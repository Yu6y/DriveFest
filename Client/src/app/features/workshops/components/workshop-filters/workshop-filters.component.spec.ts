import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopFiltersComponent } from './workshop-filters.component';
import { WorkshopStateService } from '../../services/workshop-state.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Tag } from '../../../../shared/models/Tag';
import { of } from 'rxjs';

describe('WorkshopFiltersComponent', () => {
  let component: WorkshopFiltersComponent;
  let fixture: ComponentFixture<WorkshopFiltersComponent>;

  let mockWorkshopStateService: any;

  beforeEach(async () => {
    const mockTags: Tag[] = [];

    mockWorkshopStateService = {
      getTags: jasmine.createSpy('getTags').and.returnValue(of(mockTags)),
      loadFilteredWorkshops: jasmine.createSpy('loadFilteredWorkshops'),
    };

    await TestBed.configureTestingModule({
      imports: [WorkshopFiltersComponent, ReactiveFormsModule],
      providers: [
        {
          provide: WorkshopStateService,
          useValue: mockWorkshopStateService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopFiltersComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
