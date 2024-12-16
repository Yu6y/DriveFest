import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkshopComponent } from './add-workshop.component';
import { WorkshopStateService } from '../../workshops/services/workshop-state.service';
import { of } from 'rxjs';

describe('AddWorkshopComponent', () => {
  let component: AddWorkshopComponent;
  let fixture: ComponentFixture<AddWorkshopComponent>;

  beforeEach(async () => {
    let api = {
      getWorkshopsTags: jasmine
        .createSpy('getWorkshopsTags')
        .and.returnValue(of([])),
    };
    await TestBed.configureTestingModule({
      imports: [AddWorkshopComponent],
      providers: [
        {
          provide: WorkshopStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
