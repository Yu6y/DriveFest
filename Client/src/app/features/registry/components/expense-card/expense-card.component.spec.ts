import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCardComponent } from './expense-card.component';
import { Expense } from '../../../../shared/models/Expense';
import { EXPENSE_TYPE } from '../../../../shared/models/ExpenseType';
import { By } from '@angular/platform-browser';

describe('ExpenseCardComponent', () => {
  let component: ExpenseCardComponent;
  let fixture: ComponentFixture<ExpenseCardComponent>;

  beforeEach(async () => {
    const expense: Expense = {
      id: 0,
      type: EXPENSE_TYPE.FUEL,
      price: 0,
      date: '',
      description: '',
    };
    await TestBed.configureTestingModule({
      imports: [ExpenseCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseCardComponent);
    component = fixture.componentInstance;
    component.value = expense;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display data', () => {
    const data: Expense = {
      id: 1,
      type: EXPENSE_TYPE.FUEL,
      price: 2131.23,
      date: '2000-10-10',
      description: 'desc',
    };

    component.value = data;

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.type')).nativeElement.textContent
    ).toBe(EXPENSE_TYPE.FUEL);

    expect(
      fixture.debugElement.query(By.css('.price')).nativeElement.textContent
    ).toBe('Kwota: 2131.23 zł');

    expect(
      fixture.debugElement.query(By.css('.date')).nativeElement.textContent
    ).toBe(data.date);

    expect(
      fixture.debugElement.query(By.css('.desc')).nativeElement.textContent
    ).toBe(data.description);
  });
});
