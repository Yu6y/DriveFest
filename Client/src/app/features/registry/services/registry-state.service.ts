import { inject, Injectable } from '@angular/core';
import { RegistryApiService } from './registry-api.service';
import {
  AddExpenseFormValue,
  EditCarFormValue,
  EditRegistryFromValue,
} from '../components/popup/popup.component';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  delay,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import { LoadingState } from '../../../shared/models/LoadingState';
import { Expense } from '../../../shared/models/Expense';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toast.service';
import { CarRegistry } from '../../../shared/models/CarRegistry';
import { EXPENSE_TYPE, ExpenseType } from '../../../shared/models/ExpenseType';
import { ChartData } from '../../../shared/models/ChartData';
import { ExpenseDescription } from '../../../shared/models/ExpenseDesc';
import { Car } from '../../../shared/models/Car';

@Injectable({
  providedIn: 'root',
})
export class RegistryStateService {
  private apiService = inject(RegistryApiService);
  private datePipe = inject(DateCustomPipe);
  private toastService = inject(ToastService);
  private expensesListSubject$ = new BehaviorSubject<LoadingState<Expense[]>>({
    state: 'idle',
  });
  private registrySubject$ = new BehaviorSubject<LoadingState<CarRegistry>>({
    state: 'idle',
  });
  private expensesFilters: ExpenseType[] = [
    EXPENSE_TYPE.FUEL,
    EXPENSE_TYPE.SERVICE,
    EXPENSE_TYPE.PARKING,
    EXPENSE_TYPE.OTHER,
  ];
  private chartDataSubject$ = new BehaviorSubject<LoadingState<ChartData[]>>({
    state: 'idle',
  });
  private currYearDataSubject$ = new BehaviorSubject<string>('');
  private expenseDescSubject$ = new BehaviorSubject<ExpenseDescription[]>([
    { value: 'fuel', name: 'Tankowanie', color: 'green' },
    { value: 'service', name: 'Serwis', color: 'black' },
    { value: 'parking', name: 'Parking', color: 'blue' },
    { value: 'other', name: 'Inne', color: 'red' },
    { value: 'sum', name: 'Suma', color: 'orange' },
  ]);
  private yearsDataSubject$ = new BehaviorSubject<string[]>([]);
  private carsListSubject$ = new BehaviorSubject<LoadingState<Car[]>>({
    state: 'idle',
  });

  expensesList$ = this.expensesListSubject$.asObservable();
  registry$ = this.registrySubject$.asObservable();

  combinedConditions$ = combineLatest([
    this.currYearDataSubject$,
    this.chartDataSubject$,
    this.expenseDescSubject$,
    this.yearsDataSubject$,
  ]).pipe(
    map(([currYear, chart, desc, years]) => ({
      currYear,
      chart,
      desc,
      years,
    }))
  );

  carsList$ = this.carsListSubject$.asObservable();
  currCarId!: number;

  changeFilters(filters: ExpenseType[]) {
    if (filters.length === 0) {
      this.toastService.showToast('Zaznacz przynajmniej jeden typ.', 'info');
      return;
    }
    console.log(filters);
    this.expensesFilters = filters;
    let expenseDesc: ExpenseDescription[] = [];

    this.expensesFilters.forEach((x) => {
      if (x === 'Tankowanie')
        expenseDesc.push({ value: 'fuel', name: 'Tankowanie', color: 'green' });
      else if (x === 'Serwis')
        expenseDesc.push({ value: 'service', name: 'Serwis', color: 'black' });
      else if (x === 'Parking')
        expenseDesc.push({ value: 'parking', name: 'Parking', color: 'blue' });
      else expenseDesc.push({ value: 'other', name: 'Inne', color: 'red' });
    });

    if (expenseDesc.length > 1)
      expenseDesc.push({ value: 'sum', name: 'Suma', color: 'orange' });

    this.expenseDescSubject$.next(expenseDesc);
    this.getExpenses();
  }

  loadCars() {
    this.carsListSubject$.next({ state: 'loading' });
    this.apiService
      .getCars()
      .pipe(
        tap((res) => {
          this.carsListSubject$.next({ state: 'success', data: res });
        }),
        catchError((error) => {
          console.error('Error', error);
          this.carsListSubject$.next({ state: 'error', error: error });
          return of(false);
        })
      )
      .subscribe();
  }

  addCar(car: EditCarFormValue) {
    car.name = car.name.trim();
    const currentState = this.carsListSubject$.value;

    if (currentState.state !== 'success' || !currentState.data) {
      this.toastService.showToast('Niepowodzenie.', 'error');
      return;
    }

    const form = new FormData();
    form.append('Name', car.name);
    form.append('PhotoURL', car.photoURL ? car.photoURL : '');

    this.carsListSubject$.next({ state: 'loading' });

    this.apiService
      .addCar(form)
      .pipe(
        tap((res) => {
          this.carsListSubject$.next({
            state: 'success',
            data: [...currentState.data, res],
          });
          this.toastService.showToast('Dodano pojazd.', 'success');
        }),
        catchError((error) => {
          this.toastService.showToast('Nie udało się dodać pojazdu.', 'error');
          console.log(error);
          this.loadCars();
          return throwError(error);
        })
      )
      .subscribe();
  }

  editCar(car: EditCarFormValue, id: string) {
    car.name = car.name.trim();
    const currentState = this.carsListSubject$.value;

    if (currentState.state !== 'success' || !currentState.data) {
      this.toastService.showToast('Niepowodzenie.', 'error');
      return;
    }

    const form = new FormData();
    form.append('Id', id);
    form.append('Name', car.name);
    form.append('PhotoURL', car.photoURL ? car.photoURL : '');

    this.carsListSubject$.next({ state: 'loading' });

    this.apiService
      .editCar(form)
      .pipe(
        tap(() => {
          this.loadCars();
          this.toastService.showToast('Zaaktualizowano pojazd.', 'success');
        }),
        catchError((error) => {
          this.toastService.showToast(
            'Nie udało się zaaktualizować pojazdu.',
            'error'
          );
          console.log(error);
          this.loadCars();
          return throwError(error);
        })
      )
      .subscribe();
  }

  deleteCar(id: number) {
    const currentState = this.carsListSubject$.value;

    if (currentState.state !== 'success' || !currentState.data) {
      this.toastService.showToast('Niepowodzenie.', 'error');
      return;
    }

    this.carsListSubject$.next({ state: 'loading' });

    this.apiService
      .deleteCar(id)
      .pipe(
        tap(() => {
          this.carsListSubject$.next({
            state: 'success',
            data: currentState.data.filter((x) => x.id != id),
          });
          this.toastService.showToast('Usunięto pojazd.', 'success');
        }),
        catchError((error) => {
          this.toastService.showToast('Nie udało się usunąć pojazdu.', 'error');
          console.log(error);
          return throwError(error);
        })
      )
      .subscribe();
  }

  getExpenses() {
    this.expensesListSubject$.next({ state: 'loading' });
    this.apiService
      .getExpenses(this.expensesFilters, this.currCarId)
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
              this.getYears();
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
    expense.description = expense.description.trim();
    const currentExpensesState = this.expensesListSubject$.value;

    if (
      currentExpensesState.state !== 'success' ||
      !currentExpensesState.data
    ) {
      return;
    }

    this.apiService
      .addExpense(expense, this.currCarId)
      .pipe(
        tap((response) => {
          response.date = this.datePipe.transform(response.date);
          this.toastService.showToast('Dodano wydatek.', 'success');
          this.getExpenses();
          this.getYears();
        }),
        catchError((error) => {
          this.toastService.showToast('Nie udało się dodać wydatku.', 'error');
          console.error('Nie udało się dodać wydatku.', error);
          return of(false);
        })
      )
      .subscribe();
  }

  deleteAllExpenses() {
    if (this.expensesListSubject$.value.state === 'success') {
      this.apiService
        .deleteAllExpenses(this.currCarId)
        .pipe(
          tap(() => {
            this.toastService.showToast('Usunięto wydatki.', 'success');
            this.expensesListSubject$.next({
              state: 'success',
              data: [],
            });

            this.getYears();
          }),
          catchError((error) => {
            this.toastService.showToast(
              'Nie udało się usunąć wydatków.',
              'error'
            );
            console.error('Nie udało się usunąć wydatków.', error);
            return throwError(error);
          })
        )
        .subscribe();
    }
  }

  deleteExpense(id: number) {
    console.log('delete' + id);
    const currentExpensesState = this.expensesListSubject$.value;
    if (
      currentExpensesState.state !== 'success' ||
      !currentExpensesState.data
    ) {
      return;
    }

    this.apiService
      .deleteExpense(id)
      .pipe(
        tap(() => {
          this.toastService.showToast('Usunięto wydatek.', 'success');
          const currList = currentExpensesState.data;

          this.expensesListSubject$.next({
            state: 'success',
            data: currList.filter((x) => x.id !== id),
          });

          this.getYears();
        }),
        catchError((error) => {
          this.toastService.showToast('Nie udało się usunąć wydatku.', 'error');
          console.error('Nie udało się dodać wydatku.', error);
          return throwError(error);
        })
      )
      .subscribe();
  }

  editExpense(id: number, expense: AddExpenseFormValue) {
    const currentExpensesState = this.expensesListSubject$.value;
    if (
      currentExpensesState.state !== 'success' ||
      !currentExpensesState.data
    ) {
      return;
    }

    this.apiService
      .editExpense(id, expense)
      .pipe(
        tap(() => {
          this.toastService.showToast('Zaaktualizowano wydatek.', 'success');
          this.getExpenses();

          this.getYears();
        }),
        catchError((error) => {
          this.toastService.showToast(
            'Nie udało się edytować wydatku.',
            'error'
          );
          console.error('Nie udało się edytować wydatku.', error);
          return of(false);
        })
      )
      .subscribe();
  }

  getYears() {
    //
    if (this.expensesFilters.length === 0) {
      this.expenseDescSubject$.next([]);
      return;
    }
    return this.apiService
      .getYears(this.expensesFilters, this.currCarId)
      .pipe(
        tap((years) => {
          if (years.length > 0) {
            this.currYearDataSubject$.next(years[0]);
            this.yearsDataSubject$.next(years);
          }
          this.getChartData();
        }),
        catchError((err) => {
          console.log(err);
          return throwError(err);
        })
      )
      .subscribe();
  }

  setYear(year: string) {
    this.currYearDataSubject$.next(year);
  }

  getChartData() {
    console.log(this.currYearDataSubject$.value);
    if (
      this.currYearDataSubject$.value === undefined ||
      this.currYearDataSubject$.value === ''
    )
      this.chartDataSubject$.next({ state: 'error', error: 'Brak danych' });
    this.chartDataSubject$.next({ state: 'loading' });

    this.apiService
      .getChart(
        this.expensesFilters,
        +this.currYearDataSubject$.value,
        this.currCarId
      )
      .pipe(
        tap((res) => {
          this.chartDataSubject$.next({ state: 'success', data: res });
        }),
        catchError((err) => {
          console.log(err);
          this.chartDataSubject$.next({ state: 'error', error: err });
          return throwError(err);
        })
      )
      .subscribe();
  }

  getCarRegistry() {
    this.registrySubject$.next({ state: 'loading' });

    this.apiService
      .getRegistry(this.currCarId)
      .pipe(
        tap((res) => {
          if (res.insurance)
            res.insurance = this.datePipe.transform(res.insurance);
          if (res.tech) res.tech = this.datePipe.transform(res.tech);
          this.registrySubject$.next({ state: 'success', data: res });
        }),
        catchError((error) => {
          console.log(error);
          this.registrySubject$.next({
            state: 'error',
            error: 'Nie udało się załadować danych',
          });

          return throwError(error);
        })
      )
      .subscribe();
  }

  deleteCarRegistry() {
    this.registrySubject$.next({ state: 'loading' });

    this.apiService.deleteRegistry(this.currCarId).subscribe(
      (res) => {
        this.getCarRegistry();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  editRegistry(registry: EditRegistryFromValue) {
    this.registrySubject$.next({ state: 'loading' });

    this.apiService
      .editRegistry(registry, this.currCarId)
      .pipe(
        tap((res) => {
          if (res.insurance)
            res.insurance = this.datePipe.transform(res.insurance);
          if (res.tech) res.tech = this.datePipe.transform(res.tech);
          this.registrySubject$.next({ state: 'success', data: res });
        }),
        catchError((error) => {
          console.log(error);
          this.registrySubject$.next({
            state: 'error',
            error: 'Nie udało się załadować danych',
          });

          return throwError(error);
        })
      )
      .subscribe();
  }

  setCarId(id: number) {
    this.currCarId = id;
  }

  prepareReg() {
    this.changeFilters([
      EXPENSE_TYPE.FUEL,
      EXPENSE_TYPE.SERVICE,
      EXPENSE_TYPE.PARKING,
      EXPENSE_TYPE.OTHER,
    ]);
  }
}
