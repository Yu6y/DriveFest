import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsListPageComponent } from './events-list-page.component';
import { AdminStateService } from '../../services/admin-state.service';

describe('EventsListPageComponent', () => {
  let component: EventsListPageComponent;
  let fixture: ComponentFixture<EventsListPageComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('AdminStateService', ['loadEventsList']);
    await TestBed.configureTestingModule({
      imports: [EventsListPageComponent],
      providers: [
        {
          provide: AdminStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
