import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Expense } from '../../../shared/models/Expense';
import { Observable } from 'rxjs';
import { AddExpenseFormValue } from '../components/popup/popup.component';

@Injectable({
  providedIn: 'root',
})
export class RegistryApiService {
  private httpClient = inject(HttpClient);
  private URL = 'http://localhost:5253/api/register/expense';

  getExpenses(): Observable<Expense[]> {
    return this.httpClient.get<Expense[]>(this.URL);
  }

  postExpense(expense: AddExpenseFormValue): Observable<Expense> {
    return this.httpClient.post<Expense>(this.URL, expense);
  }
}
