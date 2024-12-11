import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Expense } from '../../../shared/models/Expense';
import { Observable } from 'rxjs';
import {
  AddExpenseFormValue,
  EditRegistryFromValue,
} from '../components/popup/popup.component';
import { CarRegistry } from '../../../shared/models/CarRegistry';
import { ExpenseType } from '../../../shared/models/ExpenseType';
import { ChartData } from '../../../shared/models/ChartData';
import { Car } from '../../../shared/models/Car';

@Injectable({
  providedIn: 'root',
})
export class RegistryApiService {
  private httpClient = inject(HttpClient);
  private URL = 'http://localhost:5253/api/register';

  getExpenses(types: ExpenseType[], carId: number): Observable<Expense[]> {
    return this.httpClient.get<Expense[]>(`${this.URL}/${carId}/expense`, {
      params: {
        filters: types.map((v) => v).join(','),
      },
    });
  }

  addExpense(expense: AddExpenseFormValue, carId: number): Observable<Expense> {
    return this.httpClient.post<Expense>(
      `${this.URL}/${carId}/expense`,
      expense
    );
  }

  deleteAllExpenses(carId: number): Observable<string> {
    return this.httpClient.delete(`${this.URL}/${carId}/expense`, {
      responseType: 'text',
    });
  }

  deleteExpense(id: number): Observable<string> {
    return this.httpClient.delete(`${this.URL}/expense/${id}`, {
      responseType: 'text',
    });
  }

  editExpense(id: number, expense: AddExpenseFormValue) {
    return this.httpClient.patch(`${this.URL}/expense`, {
      id: id,
      type: expense.type,
      price: expense.price,
      date: expense.date,
      description: expense.description,
    });
  }

  getYears(types: ExpenseType[], carId: number) {
    return this.httpClient.get<string[]>(`${this.URL}/${carId}/expense/years`, {
      params: {
        filters: types.map((v) => v).join(','),
      },
    });
  }

  getChart(types: ExpenseType[], year: number, carId: number) {
    return this.httpClient.get<ChartData[]>(
      `${this.URL}/${carId}/expense/chart`,
      {
        params: {
          filters: types.map((v) => v).join(','),
          year: year,
        },
      }
    );
  }

  getRegistry(carId: number) {
    return this.httpClient.get<CarRegistry>(`${this.URL}/${carId}/registry`);
  }

  editRegistry(registry: EditRegistryFromValue, carId: number) {
    return this.httpClient.post<CarRegistry>(
      `${this.URL}/${carId}/registry`,
      registry
    );
  }

  deleteRegistry(carId: number) {
    return this.httpClient.delete(`${this.URL}/${carId}/registry`, {
      responseType: 'text',
    });
  }

  getCars() {
    return this.httpClient.get<Car[]>(`${this.URL}/cars`);
  }

  addCar(car: FormData) {
    return this.httpClient.post<Car>(`${this.URL}/cars`, car);
  }

  editCar(car: FormData) {
    return this.httpClient.patch<Car>(`${this.URL}/cars`, car);
  }

  deleteCar(id: number) {
    return this.httpClient.delete(`${this.URL}/cars/${id}`, {
      responseType: 'text',
    });
  }
}
