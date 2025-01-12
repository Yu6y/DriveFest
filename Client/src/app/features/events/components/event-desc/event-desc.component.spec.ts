import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDescComponent } from './event-desc.component';
import { ActivatedRoute } from '@angular/router';
import { EventStateService } from '../../services/event-state.service';
import { EventDesc } from '../../../../shared/models/EventDesc';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { WorkshopStateService } from '../../../workshops/services/workshop-state.service';

describe('EventDescComponent', () => {
  let component: EventDescComponent;
  let fixture: ComponentFixture<EventDescComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('EventStateService', [
      'getEventDesc',
      'loadComments',
    ]);
    let workshopapi = jasmine.createSpyObj('WorkshopStateService', ['']);
    const activatedRouteMock = {
      snapshot: {
        params: { id: '1' },
        queryParams: {},
      },
    };

    await TestBed.configureTestingModule({
      imports: [EventDescComponent],
      providers: [
        { provide: EventStateService, useValue: api },
        { provide: WorkshopStateService, useValue: workshopapi },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display desc', async () => {
    const mock: EventDesc = {
      id: 1,
      name: 'event',
      image: '',
      date: '2024-04-11',
      location: 'location',
      followersCount: 0,
      voivodeship: 'voiv',
      tags: [],
      isFavorite: false,
      isVerified: false,
      address: 'address',
      description: 'desc',
      eventDescId: 0,
    };

    component.event$ = of({ state: 'success', data: mock });

    fixture.detectChanges();

    await fixture.whenStable();

    const elem = fixture.debugElement;
    expect(elem.query(By.css('.event-name')).nativeElement.textContent).toBe(
      'event'
    );
    expect(
      elem.queryAll(By.css('.desc-text'))[1].nativeElement.textContent
    ).toBe('location, address');
    expect(elem.query(By.css('.description')).nativeElement.textContent).toBe(
      'desc'
    );
  });
});
