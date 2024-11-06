import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Expense } from '../../../../shared/models/Expense';
import { EXPENSE_TYPE } from '../../../../shared/models/ExpenseType';
import { PopupService } from '../../../../shared/services/popup.service';
import { POPUP_TYPE } from '../../../../shared/models/PopupType';

@Component({
  selector: 'app-expense-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './expense-card.component.html',
  styleUrl: './expense-card.component.scss',
})
export class ExpenseCardComponent {
  private popupService = inject(PopupService);
  protected types = EXPENSE_TYPE;
  @Input({ required: true }) value!: Expense;

  deleteExpense() {    
    this.popupService.setFlag(POPUP_TYPE.DELETE);
    this.popupService.setData(this.value);
    this.popupService.showPopup();
  }

  editExpense() {
    this.popupService.setFlag(POPUP_TYPE.EDIT);
    this.popupService.setData(this.value);
    this.popupService.showPopup();
  }
}
