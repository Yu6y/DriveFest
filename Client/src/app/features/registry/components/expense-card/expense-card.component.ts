import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Expense } from '../../../../shared/models/Expense';

@Component({
  selector: 'app-expense-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './expense-card.component.html',
  styleUrl: './expense-card.component.scss',
})
export class ExpenseCardComponent {
  @Input({ required: true }) value!: Expense;

  deleteExpense() {
    console.log('delete');
  }

  editExpense() {
    console.log('edit');
  }
}
