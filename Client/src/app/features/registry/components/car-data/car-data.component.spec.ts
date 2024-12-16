import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarDataComponent } from './car-data.component';
import { RegistryStateService } from '../../services/registry-state.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CarRegistry } from '../../../../shared/models/CarRegistry';
import { LoadingState } from '../../../../shared/models/LoadingState';

describe('CarDataComponent', () => {
  let component: CarDataComponent;
  let fixture: ComponentFixture<CarDataComponent>;

  beforeEach(async () => {
    const data: CarRegistry = {
      course: '',
      insurance: null,
      tech: null,
      engineOil: '',
      transmissionOil: '',
      brakes: '',
    };
    let api = jasmine.createSpyObj(
      'RegistryStateService',
      ['setCarId', 'prepareReg', 'getCarRegistry'],
      {
        registry$: of({
          state: 'success',
          data: data,
        } as LoadingState<CarRegistry>),
      }
    );

    const activatedRoute = {
      snapshot: {
        params: { id: '123' },
        queryParams: {},
      },
    };

    await TestBed.configureTestingModule({
      imports: [CarDataComponent],
      providers: [
        {
          provide: RegistryStateService,
          useValue: api,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
