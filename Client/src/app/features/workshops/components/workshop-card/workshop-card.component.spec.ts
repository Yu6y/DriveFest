import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopCardComponent } from './workshop-card.component';
import { WorkshopShort } from '../../../../shared/models/WorkshopShort';

describe('WorkshopCardComponent', () => {
  let component: WorkshopCardComponent;
  let fixture: ComponentFixture<WorkshopCardComponent>;

  beforeEach(async () => {
    const data: WorkshopShort = {
      id: 0,
      name: '',
      location: '',
      voivodeship: '',
      tags: [],
      rate: 0,
      image: '',
      ratesCount: 0,
      isVerified: false,
    };
    await TestBed.configureTestingModule({
      imports: [WorkshopCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopCardComponent);
    component = fixture.componentInstance;
    component.workshop = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
