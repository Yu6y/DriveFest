import { TestBed } from '@angular/core/testing';

import { RegistryApiService } from './registry-api.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Expense } from '../../../shared/models/Expense';
import { AddExpenseFormValue } from '../components/popup-expense-form/popup-expense-form.component';
import { EXPENSE_TYPE, ExpenseType } from '../../../shared/models/ExpenseType';
import { ChartData } from '../../../shared/models/ChartData';
import { Car } from '../../../shared/models/Car';
import { CarRegistry } from '../../../shared/models/CarRegistry';

describe('RegistryApiService', () => {
  let service: RegistryApiService;
  const URL = 'http://localhost:5253/api/register';
  let testingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RegistryApiService);
    testingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get expenses', () => {
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

    service.getExpenses(['Serwis', 'Tankowanie'], 0).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res[0].id).toBe(0);
      expect(res[1].price).toBe(9999.99);
    });
    const req = testingController.expectOne(
      `${URL}/0/expense?filters=Serwis,Tankowanie`
    );
    expect(req.request.method).toBe('GET');
    req.flush(expected);
  });

  it('should add an expense', () => {
    const carId = 1;
    const expense: AddExpenseFormValue = {
      type: 'Tankkowanie',
      price: 10.11,
      date: '2020-01-11',
      description: 'desc',
    };

    const data: Expense = {
      id: 1,
      type: EXPENSE_TYPE.FUEL,
      price: 10.11,
      date: '2020-01-11',
      description: 'desc',
    };

    service.addExpense(expense, carId).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.type).toBe('Tankowanie');
      expect(res.price).toBe(10.11);
    });

    const req = testingController.expectOne(`${URL}/${carId}/expense`);
    expect(req.request.method).toBe('POST');
    req.flush(data);
  });

  it('should delete all expenses', () => {
    const carId = 1;
    const data = 'All expenses deleted';

    service.deleteAllExpenses(carId).subscribe((res) => {
      expect(res).toBe(data);
    });

    const req = testingController.expectOne(`${URL}/${carId}/expense`);
    expect(req.request.method).toBe('DELETE');
    req.flush(data);
  });

  it('should delete expense', () => {
    const data = 'Ok.';
    const id = 1;

    service.deleteExpense(id).subscribe((res) => {
      expect(res).toBe(data);
    });

    const req = testingController.expectOne(`${URL}/expense/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(data);
  });

  it('should edit expense', () => {
    const data: Expense = {
      id: 0,
      type: 'Inne',
      price: 10.99,
      date: '2020-12-12',
      description: 'desc',
    };

    service.editExpense(data.id, data).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = testingController.expectOne(`${URL}/expense`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({
      id: data.id,
      type: data.type,
      price: data.price,
      date: data.date,
      description: data.description,
    });

    req.flush(data);
  });

  it('should get years', () => {
    const data: string[] = ['2024', '2025'];

    service.getYears(['Inne'], 1).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res[0]).toBe('2024');
    });

    const req = testingController.expectOne(
      `${URL}/1/expense/years?filters=Inne`
    );
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should get chart', () => {
    const types: ExpenseType[] = ['Tankowanie', 'Parking'];
    const carId = 1;
    const year = 2025;
    const data: ChartData[] = [
      {
        month: 'Styczen',
        fuel: 10,
        service: 0,
        parking: 0,
        other: 0,
        sum: 10,
      },
      {
        month: 'Luty',
        fuel: 1213.32,
        service: 213.21,
        parking: 0,
        other: 10,
        sum: 2121.12,
      },
    ];

    service.getChart(types, year, carId).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res[0].month).toBe('Styczen');
      expect(res[1].sum).toBe(2121.12);
    });

    const req = testingController.expectOne(
      `${URL}/1/expense/chart?filters=Tankowanie,Parking&year=2025`
    );
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should get registry', () => {
    const data: CarRegistry = {
      course: '2131',
      insurance: null,
      tech: null,
      engineOil: '0',
      transmissionOil: '0',
      brakes: '213',
    };

    service.getRegistry(1).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toBe(data);
      expect(res.tech).toBeNull();
    });

    const req = testingController.expectOne(`${URL}/1/registry`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should edit registry', () => {
    const data: CarRegistry = {
      course: '2131',
      insurance: null,
      tech: null,
      engineOil: '0',
      transmissionOil: '0',
      brakes: '213',
    };

    service.editRegistry(data, 1).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toBe(data);
      expect(res.tech).toBeNull();
    });

    const req = testingController.expectOne(`${URL}/1/registry`);
    expect(req.request.method).toBe('POST');
    req.flush(data);
  });

  it('should delete registry', () => {
    const data = 'Registry deleted';

    service.deleteRegistry(1).subscribe((res) => {
      expect(res).toBe(data);
    });

    const req = testingController.expectOne(`${URL}/1/registry`);
    expect(req.request.method).toBe('DELETE');
    req.flush(data);
  });

  it('should get cars', () => {
    const data: Car[] = [
      {
        id: 0,
        name: 'Car 1',
        photoUrl: '',
      },
      {
        id: 1,
        name: 'Car 2',
        photoUrl: '',
      },
    ];

    service.getCars().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.length).toBe(2);
      expect(res[0].name).toBe('Car 1');
    });

    const req = testingController.expectOne(`${URL}/cars`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should add car', () => {
    const form = new FormData();
    form.append('Name', 'Car');
    form.append('PhotoURL', '');

    const data: Car = {
      id: 0,
      name: 'Car',
      photoUrl: '',
    };

    service.addCar(form).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toBe(data);
    });

    const req = testingController.expectOne(`${URL}/cars`);
    expect(req.request.method).toBe('POST');
    req.flush(data);
  });

  it('should edit car', () => {
    const data: Car = {
      id: 0,
      name: 'Car1',
      photoUrl: '',
    };

    const form = new FormData();
    form.append('Name', 'Car1');
    form.append('PhotoURL', '');

    service.editCar(form).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toBe(data);
    });

    const req = testingController.expectOne(`${URL}/cars`);
    expect(req.request.method).toBe('PATCH');
    req.flush(data);
  });

  it('should delete car', () => {
    const data = 'Car deleted';

    service.deleteCar(1).subscribe((res) => {
      expect(res).toBe(data);
    });

    const req = testingController.expectOne(`${URL}/cars/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(data);
  });
});
