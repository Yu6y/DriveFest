import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarCardComponent } from './car-card.component';
import { Car } from '../../../../shared/models/Car';
import { By } from '@angular/platform-browser';

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

  it('should display data', () => {
    const car: Car = {
      id: 0,
      name: 'car',
      photoUrl: '',
    };
    component.value = car;

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.p-name')).nativeElement.textContent
    ).toBe('car');
  });
});
