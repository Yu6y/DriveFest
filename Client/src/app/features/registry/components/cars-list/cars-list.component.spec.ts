import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsListComponent } from './cars-list.component';
import { RegistryStateService } from '../../services/registry-state.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Car } from '../../../../shared/models/Car';

describe('CarsListComponent', () => {
  let component: CarsListComponent;
  let fixture: ComponentFixture<CarsListComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('RegistryStateService', { loadCars: null });
    await TestBed.configureTestingModule({
      imports: [CarsListComponent],
      providers: [
        {
          provide: RegistryStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 2 cards', () => {
    const data: Car = {
      id: 0,
      name: 'car',
      photoUrl: '',
    };

    component.carsList$ = of({ state: 'success', data: [data, data] });

    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-car-card'));
    expect(cards.length).toBe(2);
  });

  it('should display loading indicator', () => {
    component.carsList$ = of({ state: 'loading' });

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('dx-load-indicator')).nativeElement
    ).toBeTruthy();
  });

  it('should display error', () => {
    component.carsList$ = of({ state: 'error', error: 'Error' });

    fixture.detectChanges();

    expect(
      fixture.debugElement
        .queryAll(By.css('.text-center'))
        .find(
          (x) =>
            x.nativeElement.textContent === 'Nie udało się załadować danych.'
        )
    ).toBeTruthy();
  });
});
