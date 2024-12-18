import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { WorkshopDescComponent } from './workshop-desc.component';
import { WorkshopStateService } from '../../services/workshop-state.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Tag } from '../../../../shared/models/Tag';
import { WorkshopDesc } from '../../../../shared/models/WorkshopDesc';
import { By } from '@angular/platform-browser';
import { EventStateService } from '../../../events/services/event-state.service';

describe('WorkshopDescComponent', () => {
  let component: WorkshopDescComponent;
  let fixture: ComponentFixture<WorkshopDescComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('WorkshopStateService', [
      'getWorkshopDesc',
      'getWorkshopRate',
      'loadComments',
    ]);
    let mockEventState = jasmine.createSpyObj('EventStateService', ['']);
    api.getWorkshopRate.and.returnValue(of(1));
    const activatedRouteMock = {
      snapshot: {
        params: { id: '1' },
        queryParams: {},
      },
    };

    await TestBed.configureTestingModule({
      imports: [WorkshopDescComponent],
      providers: [
        { provide: WorkshopStateService, useValue: api },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: EventStateService, useValue: mockEventState },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make tags', () => {
    const tags: Tag[] = [
      {
        id: 1,
        name: 'tag',
      },
      {
        id: 2,
        name: 'tag2',
      },
    ];

    const data = component.makeTags(tags);
    expect(data).toBe('tag, tag2');
  });

  it('should display data', () => {
    const data: WorkshopDesc = {
      id: 0,
      name: 'workshop',
      location: 'location',
      voivodeship: 'voiv',
      tags: [],
      rate: 0,
      image: 'image',
      ratesCount: 0,
      isVerified: false,
      address: 'address',
      description: 'desc',
      workshopDescId: 1,
    };

    component.workshop$ = of({ state: 'success', data: data });

    fixture.detectChanges();

    component.workshop$.subscribe((res) => {
      expect(res.state).toBe('success');
      if (res.state === 'success') {
        expect(
          fixture.debugElement.query(By.css('.workshop-name')).nativeElement
            .textContent
        ).toBe('workshop');

        expect(
          fixture.debugElement.query(By.css('.desc-text')).nativeElement
            .textContent
        ).toBe('location, address');

        expect(
          fixture.debugElement.query(By.css('.description')).nativeElement
            .textContent
        ).toBe('desc');
      }
    });
  });
});
