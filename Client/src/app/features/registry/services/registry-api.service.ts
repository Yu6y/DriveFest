import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Expense } from '../../../shared/models/Expense';
import { Observable } from 'rxjs';
import {
  AddExpenseFormValue,
  EditRegistryFromValue,
} from '../components/popup/popup.component';
import { EditExpense } from '../../../shared/models/EditExpense';
import { isExpressionStatement } from 'typescript';
import { CarRegistry } from '../../../shared/models/CarRegistry';
import { ExpenseType } from '../../../shared/models/ExpenseType';
import { ChartData } from '../../../shared/models/ChartData';

@Injectable({
  providedIn: 'root',
})
export class RegistryApiService {
  private httpClient = inject(HttpClient);
  private URL = 'http://localhost:5253/api/register';

  getExpenses(types: ExpenseType[]): Observable<Expense[]> {
    return this.httpClient.get<Expense[]>(`${this.URL}/expense`, {
      params: {
        filters: types.map((v) => v).join(','),
      },
    });
  }

  addExpense(expense: AddExpenseFormValue): Observable<Expense> {
    return this.httpClient.post<Expense>(`${this.URL}/expense`, expense);
  }

  deleteAllExpenses(): Observable<string> {
    return this.httpClient.delete(`${this.URL}/expense`, {
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

  getYears(types: ExpenseType[]) {
    return this.httpClient.get<string[]>(`${this.URL}/expense/years`, {
      params: {
        filters: types.map((v) => v).join(','),
      },
    });
  }

  getChart(types: ExpenseType[], year: number) {
    return this.httpClient.get<ChartData[]>(`${this.URL}/expense/chart`, {
      params: {
        filters: types.map((v) => v).join(','),
        year: year,
      },
    });
  }

  getRegistry() {
    return this.httpClient.get<CarRegistry>(`${this.URL}/registry`);
  }

  editRegistry(registry: EditRegistryFromValue) {
    return this.httpClient.post<CarRegistry>(`${this.URL}/registry`, registry);
  }

  deleteRegistry() {
    return this.httpClient.delete(`${this.URL}/registry`, {
      responseType: 'text',
    });
  }
}
