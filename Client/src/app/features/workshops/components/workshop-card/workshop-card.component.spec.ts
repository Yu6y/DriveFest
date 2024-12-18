import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopCardComponent } from './workshop-card.component';
import { WorkshopShort } from '../../../../shared/models/WorkshopShort';
import { By } from '@angular/platform-browser';

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

  it('should display data', () => {
    const workshop: WorkshopShort = {
      id: 0,
      name: 'workshop',
      location: 'location',
      voivodeship: '',
      tags: [],
      rate: 4.3,
      image: '',
      ratesCount: 0,
      isVerified: true,
    };
    component.workshop = workshop;

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.p-name')).nativeElement.textContent
    ).toBe('workshop');

    expect(
      fixture.debugElement.query(By.css('.desc-text')).nativeElement.textContent
    ).toBe('location');

    expect(
      fixture.debugElement.query(By.css('.grade-text')).nativeElement
        .textContent
    ).toBe(workshop.rate.toString());
  });
});
