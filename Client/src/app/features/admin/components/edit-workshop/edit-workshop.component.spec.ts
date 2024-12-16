import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkshopComponent } from './edit-workshop.component';
import { AdminStateService } from '../../services/admin-state.service';
import { of } from 'rxjs';
import { WorkshopEdit } from '../../../../shared/models/WorkshopEdit';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { Tag } from '../../../../shared/models/Tag';
import { CustomTag } from '../edit-event/edit-event.component';

describe('EditWorkshopComponent', () => {
  let component: EditWorkshopComponent;
  let fixture: ComponentFixture<EditWorkshopComponent>;

  beforeEach(async () => {
    const mockTags: CustomTag[] = [];
    const data: WorkshopEdit = {
      id: 0,
      name: '',
      image: '',
      photoURL: null,
      location: '',
      address: '',
      voivodeship: '',
      tags: [],
      description: '',
    };
    let api = jasmine.createSpyObj('AdminStateService', ['getWorkshopToEdit'], {
      workshopEdit$: of({
        state: 'success',
        data: data,
      } as LoadingState<WorkshopEdit>),
      tags$: of(mockTags),
    });
    Object.defineProperty(window, 'history', {
      writable: true,
      value: {
        state: { id: 'test-id' },
      },
    });

    await TestBed.configureTestingModule({
      imports: [EditWorkshopComponent],
      providers: [
        {
          provide: AdminStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditWorkshopComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
