import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { RegistryStateService } from './registry-state.service';
import { RegistryApiService } from './registry-api.service';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { ExpenseDescription } from '../../../shared/models/ExpenseDesc';
import { Car } from '../../../shared/models/Car';
import { of } from 'rxjs';
import { EditCarFormValue } from '../components/popup-car-form/popup-car-form.component';
import { Expense } from '../../../shared/models/Expense';
import { AddExpenseFormValue } from '../components/popup-expense-form/popup-expense-form.component';
import { isFakeTouchstartFromScreenReader } from '@angular/cdk/a11y';
import { ChartData } from '../../../shared/models/ChartData';
import { CarRegistry } from '../../../shared/models/CarRegistry';

describe('RegistryStateService', () => {
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
      'addExpense',
      'getChart',
      'deleteAllExpenses',
      'deleteExpense',
      'editExpense',
      'getRegistry',
      'deleteRegistry',
      'editRegistry',
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

    api.getYears.and.returnValue(of([]));
    api.getChart.and.returnValue(of([]));
    api.getExpenses.and.returnValue(of(data));
    service.getExpenses();

    tick(2000);

    service.expensesList$.subscribe((res) => {
      expect(res.state).toBe('success');
      if (res.state === 'success') {
        expect(res.data.length).toBe(2);
        expect(res.data[0].price).toBe(100.99);
        expect(res.data[1].type).toBe('Serwis');
      }
    });
  }));

  it('should add expense', fakeAsync(() => {
    const form: AddExpenseFormValue = {
      type: 'Serwis',
      price: 9999.99,
      date: '2020-10-10',
      description: 'desc',
    };
    const data: Expense[] = [
      {
        id: 0,
        type: 'Tankowanie',
        price: 100.99,
        date: '2000-10-11',
        description: 'desc',
      },
    ];
    const expense: Expense = {
      id: 1,
      type: 'Serwis',
      price: 9999.99,
      date: '2020-10-10',
      description: 'desc',
    };
    const expected: Expense[] = [
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
        price: 9999.99,
        date: '2020-10-10',
        description: 'desc',
      },
    ];
    api.getYears.and.returnValue(of([]));
    api.getChart.and.returnValue(of([]));
    api.addExpense.and.returnValue(of(expense));
    api.getExpenses.and.returnValue(of(data));

    service.getExpenses();

    tick(200);

    api.getExpenses.and.returnValue(of(expected));

    tick(2000);

    service.addExpense(form);

    tick(2000);

    service.expensesList$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data.length).toBe(2);
        expect(result.data[0].type).toBe('Tankowanie');
        expect(result.data[1].type).toBe('Serwis');
      }
    });

    flush();
  }));

  it('should delete all expenses', fakeAsync(() => {
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
        price: 9999.99,
        date: '2020-10-10',
        description: 'desc',
      },
    ];

    api.deleteAllExpenses.and.returnValue(of(''));
    api.getYears.and.returnValue(of([]));
    api.getChart.and.returnValue(of([]));
    api.getExpenses.and.returnValue(of(data));
    service.getExpenses();

    tick(2000);

    service.deleteAllExpenses();

    tick(2000);

    service.expensesList$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data.length).toBe(0);
      }
    });
  }));

  it('should delete expense', fakeAsync(() => {
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
        price: 9999.99,
        date: '2020-10-10',
        description: 'desc',
      },
    ];

    api.getYears.and.returnValue(of([]));
    api.getChart.and.returnValue(of([]));
    api.deleteExpense.and.returnValue(of(''));

    api.getExpenses.and.returnValue(of(data));
    service.getExpenses();

    tick(1200);

    service.deleteExpense(0);

    service.expensesList$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data.length).toBe(1);
        expect(result.data[0].type).toBe('Serwis');
      }
    });
  }));

  it('should edit expense', fakeAsync(() => {
    const data: Expense[] = [
      {
        id: 0,
        type: 'Tankowanie',
        price: 100.99,
        date: '2000-10-11',
        description: 'desc',
      },
    ];
    const updated: Expense[] = [
      {
        id: 0,
        type: 'Serwis',
        price: 0,
        date: '2020-12-12',
        description: '',
      },
    ];
    const form: AddExpenseFormValue = {
      type: 'Serwis',
      price: 0,
      date: '2020-12-12',
      description: '',
    };

    api.getYears.and.returnValue(of([]));
    api.getChart.and.returnValue(of([]));
    api.getExpenses.and.returnValue(of(data));
    api.editExpense.and.returnValue(of(updated[0]));
    service.getExpenses();

    tick(2000);

    api.getExpenses.and.returnValue(of(updated));

    tick(2000);

    service.editExpense(0, form);

    tick(2000);

    service.expensesList$.subscribe((result) => {
      expect(result.state).toBe('success');
      if (result.state === 'success') {
        expect(result.data.length).toBe(1);
        expect(result.data[0].type).toBe('Serwis');
      }
    });
  }));

  it('should get years', fakeAsync(() => {
    const data: string[] = ['2024', '2025'];

    api.getChart.and.returnValue(of([]));
    api.getYears.and.returnValue(of(data));
    service.getYears();

    tick(200);

    service.combinedConditions$.subscribe((res) => {
      expect(res.years.length).toBe(2);
      expect(res.currYear).toBe('2024');
    });
  }));

  it('should set year', fakeAsync(() => {
    service.setYear('2025');

    service.combinedConditions$.subscribe((res) => {
      expect(res.currYear).toBe('2025');
    });
  }));

  it('should get chart data', fakeAsync(() => {
    const data: ChartData[] = [
      {
        month: 'string',
        fuel: 10.99,
        service: 0,
        parking: 11111.99,
        other: 1010.19,
        sum: 999999.12,
      },
    ];

    api.getChart.and.returnValue(of(data));
    //service.setYear('2000');
    service.getChartData();

    service.combinedConditions$.subscribe((res) => {
      expect(res.chart.state).toBe('success');
      if (res.chart.state === 'success') {
        expect(res.chart.data[0].month).toBe('string');
        expect(res.chart.data[0].sum).toBe(999999.12);
      }
    });
  }));

  it('should get car registry', fakeAsync(() => {
    const data: CarRegistry = {
      course: '213123',
      insurance: null,
      tech: null,
      engineOil: '213213',
      transmissionOil: '321321',
      brakes: '2132133',
    };

    api.getRegistry.and.returnValue(of(data));
    service.getCarRegistry();

    service.registry$.subscribe((res) => {
      expect(res.state).toBe('success');
      if (res.state === 'success') {
        expect(res.data.insurance).toBeNull();
        expect(res.data.engineOil).toBe('213213');
      }
    });
  }));

  it('should delete car registry', fakeAsync(() => {
    const data: CarRegistry = {
      course: '213123',
      insurance: null,
      tech: null,
      engineOil: '213213',
      transmissionOil: '321321',
      brakes: '2132133',
    };
    const dataCleared: CarRegistry = {
      course: '',
      insurance: null,
      tech: null,
      engineOil: '',
      transmissionOil: '',
      brakes: '',
    };

    api.getRegistry.and.returnValue(of(data));
    service.getCarRegistry();

    tick(2000);

    let firstEmission: any;
    service.registry$.subscribe((res) => {
      firstEmission = res;
    });
    expect(firstEmission.state).toBe('success');
    expect(firstEmission.data.engineOil).toBe('213213');

    api.getRegistry.and.returnValue(of(dataCleared));
    api.deleteRegistry.and.returnValue(of(''));
    service.deleteCarRegistry();

    tick(2000);

    let secondEmission: any;
    service.registry$.subscribe((res) => {
      secondEmission = res;
    });
    expect(secondEmission.state).toBe('success');
    expect(secondEmission.data.engineOil).toBe('');
    expect(secondEmission.data.brakes).toBe('');
  }));

  it('should edit registry', fakeAsync(() => {
    const data: CarRegistry = {
      course: '213123',
      insurance: null,
      tech: null,
      engineOil: '213213',
      transmissionOil: '321321',
      brakes: '2132133',
    };
    const dataEdited: CarRegistry = {
      course: '213123',
      insurance: '2000-01-01',
      tech: '2100-10-10',
      engineOil: '213213',
      transmissionOil: '321321',
      brakes: '2132133',
    };

    api.getRegistry.and.returnValue(of(data));
    service.getCarRegistry();

    tick(2000);

    let firstEmission: any;
    service.registry$.subscribe((res) => {
      firstEmission = res;
    });
    expect(firstEmission.state).toBe('success');
    expect(firstEmission.data.engineOil).toBe('213213');
    expect(firstEmission.data.tech).toBeNull();

    api.editRegistry.and.returnValue(of(dataEdited));
    service.editRegistry(dataEdited);

    tick(2000);

    let secondEmission: any;
    service.registry$.subscribe((res) => {
      secondEmission = res;
    });
    expect(secondEmission.state).toBe('success');
    expect(secondEmission.data.tech).toBe('2100-10-10');
    expect(secondEmission.data.insurance).toBe('2000-01-01');
  }));
});
