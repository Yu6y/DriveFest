import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { CarRegistryComponent } from './car-registry.component';
import { RegistryStateService } from '../../services/registry-state.service';

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
});
