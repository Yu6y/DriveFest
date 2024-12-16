import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarCardComponent } from './car-card.component';
import { Car } from '../../../../shared/models/Car';

describe('CarCardComponent', () => {
  let component: CarCardComponent;
  let fixture: ComponentFixture<CarCardComponent>;

  beforeEach(async () => {
    const car: Car = {
      id: 0,
      name: '',
      photoUrl: '',
    };
    await TestBed.configureTestingModule({
      imports: [CarCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarCardComponent);
    component = fixture.componentInstance;
    component.value = car;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
