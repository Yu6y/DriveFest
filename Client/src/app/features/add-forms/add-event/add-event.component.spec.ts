import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventComponent } from './add-event.component';
import { EventStateService } from '../../events/services/event-state.service';
import { Tag } from '../../../shared/models/Tag';
import { of } from 'rxjs';

describe('AddEventComponent', () => {
  let component: AddEventComponent;
  let fixture: ComponentFixture<AddEventComponent>;

  beforeEach(async () => {
    const mockTags: Tag[] = [];
    let mockState = {
      getTags: jasmine.createSpy('getTags').and.returnValue(of(mockTags)),
    };
    await TestBed.configureTestingModule({
      imports: [AddEventComponent],
      providers: [
        {
          provide: EventStateService,
          useValue: mockState,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
