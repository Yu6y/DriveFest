import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventComponent } from './edit-event.component';
import { AdminStateService } from '../../services/admin-state.service';
import { of } from 'rxjs';
import { EventEdit } from '../../../../shared/models/EventEdit';
import { LoadingState } from '../../../../shared/models/LoadingState';

describe('EditEventComponent', () => {
  const data: EventEdit = {
    id: 0,
    name: '',
    image: '',
    photoURL: null,
    date: '',
    location: '',
    address: '',
    voivodeship: '',
    tags: [],
    description: '',
  };
  let component: EditEventComponent;
  let fixture: ComponentFixture<EditEventComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('AdminStateService', ['getEventToEdit'], {
      eventEdit$: of({
        state: 'success',
        data: data,
      } as LoadingState<EventEdit>),
      tags$: of([]),
    });

    Object.defineProperty(window, 'history', {
      writable: true,
      value: {
        state: { id: 'test-id' },
      },
    });

    await TestBed.configureTestingModule({
      imports: [EditEventComponent],
      providers: [
        {
          provide: AdminStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
