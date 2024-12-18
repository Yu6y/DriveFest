import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardsListComponent } from './cards-list.component';
import { EventStateService } from '../../../features/events/services/event-state.service';
import { WorkshopStateService } from '../../../features/workshops/services/workshop-state.service';
import { EventShort } from '../../models/EventShort';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('CardsListComponent', () => {
  let component: CardsListComponent;
  let fixture: ComponentFixture<CardsListComponent>;
  const data: EventShort = {
    id: 0,
    name: '',
    image: '',
    date: '',
    location: '',
    followersCount: 0,
    voivodeship: '',
    tags: [],
    isFavorite: false,
    isVerified: false,
  };
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

  it('should display 2 elements', () => {
    component.flag = 'events';
    component.eventsList$ = of({
      state: 'success',
      data: [data, data],
    });

    fixture.detectChanges();

    const workshopCards = fixture.debugElement.queryAll(
      By.css('app-event-card')
    );
    expect(workshopCards.length).toBe(2);
  });

  it('should display text while empty list', () => {
    component.flag = 'workshops';
    component.workshopsList$ = of({
      state: 'success',
      data: [],
    });

    fixture.detectChanges();

    const emptyText = fixture.debugElement.query(By.css('p'));
    expect(emptyText.nativeElement.textContent).toBe('Brak warsztatów!');
  });

  it('should display loading indicator', () => {
    component.flag = 'workshops';
    component.workshopsList$ = of({
      state: 'loading',
    });

    fixture.detectChanges();

    const indicator = fixture.debugElement.query(By.css('dx-load-indicator'));
    expect(indicator).toBeTruthy();
  });
});
