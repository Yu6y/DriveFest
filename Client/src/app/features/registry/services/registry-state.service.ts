import { inject, Injectable } from '@angular/core';
import { RegistryApiService } from './registry-api.service';
import { AddExpenseFormValue } from '../components/popup/popup.component';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import {
  BehaviorSubject,
  catchError,
  delay,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import { LoadingState } from '../../../shared/models/LoadingState';
import { Expense } from '../../../shared/models/Expense';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RegistryStateService {
  private apiService = inject(RegistryApiService);
  private datePipe = inject(DateCustomPipe);
  private expensesListSubject$ = new BehaviorSubject<LoadingState<Expense[]>>({
    state: 'idle',
  });
  expensesList$ = this.expensesListSubject$.asObservable();

  getExpenses() {
    this.expensesListSubject$.next({ state: 'loading' });
    this.apiService
      .getExpenses()
      .pipe(
        map((data) => {
          data.forEach((x) => {
            x.date = this.datePipe.transform(x.date);
          });

          return data;
        }),
        tap((response) => {
          of(response)
            .pipe(delay(1000))
            .subscribe((res) => {
              this.expensesListSubject$.next({ state: 'success', data: res });
              console.log(res);
            });
        }),
        catchError((error: HttpErrorResponse) => {
          this.expensesListSubject$.next({
            state: 'error',
            error: error.message,
          });
          return throwError(error);
        })
      )
      .subscribe();
  }

  addExpense(expense: AddExpenseFormValue) {
    this.apiService.postExpense(expense).pipe(
      map((res) => {
        res.date = this.datePipe.transform(res.date);

        return res;
      })
    );
  }
}
