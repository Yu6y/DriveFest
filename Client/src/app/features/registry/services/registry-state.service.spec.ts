import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RegistryStateService } from './registry-state.service';
import { RegistryApiService } from './registry-api.service';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { ExpenseDescription } from '../../../shared/models/ExpenseDesc';
import { Car } from '../../../shared/models/Car';
import { of } from 'rxjs';
import { EditCarFormValue } from '../components/popup-car-form/popup-car-form.component';
import { Expense } from '../../../shared/models/Expense';

fdescribe('RegistryStateService', () => {
  let service: RegistryStateService;
  let api: jasmine.SpyObj<any>;
  beforeEach(() => {
    api = jasmine.createSpyObj('RegistryApiService', [
      'getCars',
      'addCar',
      'editCar',
      'deleteCar',
      'getExpenses',
      'getYears',
    ]);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: RegistryApiService,
          useValue: api,
        },
        DateCustomPipe,
      ],
    });
    service = TestBed.inject(RegistryStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load cars', fakeAsync(() => {
    const data: Car[] = [
      {
        id: 0,
        name: 'car 1',
        photoUrl: 'pic',
      },
      {
        id: 1,
        name: 'car2',
        photoUrl: '',
      },
    ];

    api.getCars.and.returnValue(of(data));
    service.loadCars();

    tick(200);

    service.carsList$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data).toEqual(data);
        expect(result.data.length).toBe(2);
        expect(result.data[1].name).toBe('car2');
      }
    });
  }));

  it('should add car', fakeAsync(() => {
    const form: EditCarFormValue = {
      name: 'name',
      photoURL: null,
    };
    const data: Car = {
      id: 0,
      name: 'name',
      photoUrl: '',
    };

    api.getCars.and.returnValue(of([]));
    service.loadCars();

    tick(200);
    api.addCar.and.returnValue(of(data));
    service.addCar(form);

    tick(200);

    service.carsList$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data.length).toBe(1);
        console.log(result);
        expect(result.data[0].name).toBe('name');
      }
    });
  }));

  it('should delete car', fakeAsync(() => {
    const data: Car[] = [
      {
        id: 0,
        name: 'car 1',
        photoUrl: 'pic',
      },
      {
        id: 1,
        name: 'car2',
        photoUrl: '',
      },
    ];

    api.getCars.and.returnValue(of(data));
    service.loadCars();
    tick(200);

    api.deleteCar.and.returnValue(of('ok'));
    service.deleteCar(0);
    tick(200);

    service.carsList$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data.length).toBe(1);
        expect(result.data[0].name).toBe('car2');
      }
    });
  }));

  it('should edit car', fakeAsync(() => {
    const data: Car[] = [
      {
        id: 0,
        name: 'name',
        photoUrl: 'pic',
      },
    ];
    const changedCar: Car = {
      id: 0,
      name: 'name1',
      photoUrl: 'pic',
    };

    api.getCars.and.returnValue(of([data]));
    service.loadCars();

    tick(200);

    const form: EditCarFormValue = {
      name: 'name',
      photoURL: null,
    };

    api.editCar.and.returnValue(of(changedCar));
    service.editCar(form, '0');
    tick(200);

    api.getCars.and.returnValue(of([changedCar]));
    service.loadCars();

    tick(200);

    service.carsList$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data.length).toBe(1);
        console.log(result);
        expect(result.data[0].name).toBe('name1');
        expect(result.data[0].photoUrl).toBe('pic');
      }
    });
  }));

  it('should set filters', () => {
    const data: ExpenseDescription[] = [
      { value: 'service', name: 'Serwis', color: 'black' },
      { value: 'parking', name: 'Parking', color: 'blue' },
    ];

    api.getExpenses.and.returnValue(of(data));

    service.changeFilters(['Serwis', 'Parking']);

    service.combinedConditions$.subscribe((res) => {
      expect(res.desc.length).toBe(3);
      expect(res.desc[1].value).toBe('parking');
    });
  });

  it('should get expenses', fakeAsync(() => {
    const data: Expense[] = [
      {
        id: 0,
        type: 'Tankowanie',
        price: 100.99,
        date: '2000-10-11',
        description: 'desc',
      },
      {
        id: 1,
        type: 'Serwis',
        price: 0,
        date: '2000-10-11',
        description: 'desc1',
      },
    ];

    api.getExpenses.and.returnValue(of(data));
    service.getExpenses();

    tick(200);

    service.expensesList$.subscribe((res) => {
      expect(res.state).toBe('success');
      if (res.state === 'success') {
        expect(res.data.length).toBe(2);
        expect(res.data[0].price).toBe(100.99);
        expect(res.data[1].type).toBe('Serwis');
      }
    });
  }));
});
