import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopFiltersComponent } from './workshop-filters.component';
import { WorkshopStateService } from '../../services/workshop-state.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Tag } from '../../../../shared/models/Tag';
import { of } from 'rxjs';
import { SORT_BY } from '../../../../shared/models/Sort';

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

  it('should pass form', () => {
    component.form.patchValue({
      searchTerm: 'text',
      sortBy: SORT_BY.ASC,
    });
    component.selectedTags = [];
    component.selectedVoivodeships = ['voiv'];
    component.submitFilters();

    fixture.detectChanges();

    expect(mockWorkshopStateService.loadFilteredWorkshops).toHaveBeenCalledWith(
      {
        searchTerm: 'text',
        sortBy: SORT_BY.ASC,
        tags: [],
        voivodeships: ['voiv'],
      }
    );
  });

  it('should clear form', () => {
    component.form.patchValue({
      searchTerm: 'text',
      sortBy: SORT_BY.ASC,
    });
    component.selectedTags = [{ id: 1, name: 'tag' }];
    component.selectedVoivodeships = ['voiv', 'voiv2'];

    fixture.detectChanges();

    component.clearFilters();

    expect(component.form.value).toEqual({
      searchTerm: '',
      sortBy: SORT_BY.NONE,
      tags: [],
      voivodeships: [],
    });
    expect(component.selectedTags).toEqual([]);
    expect(component.selectedVoivodeships).toEqual([]);
  });

  it('should select tags', () => {
    const tag: Tag = { id: 1, name: 'tag' };
    component.selectedTags = [];

    fixture.detectChanges();

    component.inputChange(tag);
    expect(component.selectedTags[0]).toBe(tag);
    component.inputChange(tag);
    fixture.detectChanges();
    expect(component.selectedTags.length).toBe(0);
  });

  it('should select voivodeship', () => {
    component.selectedVoivodeships = [];

    fixture.detectChanges();

    component.voivChange('voiv');
    expect(component.selectedVoivodeships[0]).toBe('voiv');
    component.voivChange('voiv');
    fixture.detectChanges();
    expect(component.selectedVoivodeships.length).toBe(0);
  });
});
