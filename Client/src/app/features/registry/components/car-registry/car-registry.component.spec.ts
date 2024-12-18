import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { CarRegistryComponent } from './car-registry.component';
import { RegistryStateService } from '../../services/registry-state.service';
import { CarRegistry } from '../../../../shared/models/CarRegistry';
import { By } from '@angular/platform-browser';

describe('CarRegistryComponent', () => {
  let component: CarRegistryComponent;
  let fixture: ComponentFixture<CarRegistryComponent>;
  let mockRegisterState$: BehaviorSubject<any>;
  let mockRegistryService: any;

  beforeEach(async () => {
    mockRegisterState$ = new BehaviorSubject({
      state: 'idle',
    });

    mockRegistryService = {
      getCarRegistry: jasmine.createSpy('getCarRegistry'),
      registry$: mockRegisterState$.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [CarRegistryComponent],
      providers: [
        {
          provide: RegistryStateService,
          useValue: mockRegistryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarRegistryComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display data', () => {
    const data: CarRegistry = {
      course: '123',
      insurance: '1999-12-12',
      tech: null,
      engineOil: '12',
      transmissionOil: '213',
      brakes: '0',
    };

    component.registry$ = of({ state: 'success', data: data });

    fixture.detectChanges();

    const inputs = fixture.debugElement.queryAll(By.css('.custom-input'));

    expect(inputs[0].nativeElement.value).toBe('123 km');
    expect(inputs[1].nativeElement.value).toBe('1999-12-12');
    expect(inputs[2].nativeElement.value).toBe('');
    expect(inputs[3].nativeElement.value).toBe('12 km');
    expect(inputs[4].nativeElement.value).toBe('213 km');
    expect(inputs[5].nativeElement.value).toBe('0 km');
  });

  it('should display loading indicator', () => {
    component.registry$ = of({ state: 'loading' });

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('dx-load-indicator')).nativeElement
    ).toBeTruthy();
  });

  it('should display error', () => {
    component.registry$ = of({ state: 'error', error: 'Error' });

    fixture.detectChanges();

    expect(
      fixture.debugElement
        .queryAll(By.css('.text-center'))
        .find((x) => x.nativeElement.textContent === 'Error')
    ).toBeTruthy();
  });
});
