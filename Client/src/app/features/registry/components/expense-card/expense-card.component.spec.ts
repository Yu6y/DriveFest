import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCardComponent } from './expense-card.component';
import { Expense } from '../../../../shared/models/Expense';
import { EXPENSE_TYPE } from '../../../../shared/models/ExpenseType';

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
});
