import {
  ComponentFixture,
  ComponentFixtureNoNgZone,
  TestBed,
} from '@angular/core/testing';

import { ExpensesListComponent } from './expenses-list.component';
import { RegistryStateService } from '../../services/registry-state.service';
import { Expense } from '../../../../shared/models/Expense';
import { EXPENSE_TYPE } from '../../../../shared/models/ExpenseType';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { LoadingState } from '../../../../shared/models/LoadingState';

describe('ExpensesListComponent', () => {
  let component: ExpensesListComponent;
  let fixture: ComponentFixture<ExpensesListComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('RegistryStateService', {
      prepareReg: null,
    });
    await TestBed.configureTestingModule({
      imports: [ExpensesListComponent],
      providers: [
        {
          provide: RegistryStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading indicator', () => {
    component.list$ = of({ state: 'loading' });
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('dx-load-indicator'))
    ).toBeTruthy();
  });

  it('should display empty list message', () => {
    component.list$ = of({ state: 'success', data: [] });
    fixture.detectChanges();

    expect(
      fixture.debugElement
        .queryAll(By.css('p'))
        .find((x) => x.nativeElement.textContent === 'Brak wpisów!')
    ).toBeTruthy();
  });

  it('should button clear delete all data', () => {
    const data: Expense[] = [
      {
        id: 0,
        type: EXPENSE_TYPE.FUEL,
        price: 0,
        date: '2000-10-10',
        description: '',
      },
      {
        id: 0,
        type: EXPENSE_TYPE.FUEL,
        price: 0,
        date: '2000-10-10',
        description: '',
      },
    ];

    component.list$ = of({ state: 'success', data: data });

    fixture.detectChanges();

    component.list$.subscribe((res) => {
      expect(res.state).toBe('success');
      if (res.state === 'success') expect(res.data.length).toBeGreaterThan(0);
    });

    const btn = fixture.debugElement.query(By.css('.del-btn'));
    btn.nativeElement.click();
    component.list$ = of({ state: 'success', data: [] });

    component.list$.subscribe((res) => {
      expect(res.state).toBe('success');
      if (res.state === 'success') expect(res.data.length).toBe(0);
    });
  });
});
