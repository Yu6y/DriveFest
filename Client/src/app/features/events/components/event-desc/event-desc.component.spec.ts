import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDescComponent } from './event-desc.component';
import { ActivatedRoute } from '@angular/router';
import { EventStateService } from '../../services/event-state.service';

describe('EventDescComponent', () => {
  let component: EventDescComponent;
  let fixture: ComponentFixture<EventDescComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('EventStateService', ['getEventDesc']);
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
});
