import { Component, inject, Input } from '@angular/core';
import { ExpenseCardComponent } from '../expense-card/expense-card.component';
import { DxLoadIndicatorModule, DxScrollViewModule } from 'devextreme-angular';
import { RegistryStateService } from '../../services/registry-state.service';
import { AsyncPipe } from '@angular/common';
import {
  EXPENSE_TYPE,
  ExpenseType,
} from '../../../../shared/models/ExpenseType';
import { PopupService } from '../../../../shared/services/popup.service';
import { POPUP_TYPE } from '../../../../shared/models/PopupType';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [
    ExpenseCardComponent,
    DxScrollViewModule,
    AsyncPipe,
    DxLoadIndicatorModule,
  ],
  templateUrl: './expenses-list.component.html',
  styleUrl: './expenses-list.component.scss',
})
export class ExpensesListComponent {
  private popupService = inject(PopupService);
  private registryService = inject(RegistryStateService);
  list$ = this.registryService.expensesList$;
  protected expenseTypes = EXPENSE_TYPE;
  selectedTypes$!: Observable<ExpenseType[]>;
  private expensesFilters: ExpenseType[] = [
    EXPENSE_TYPE.FUEL,
    EXPENSE_TYPE.SERVICE,
    EXPENSE_TYPE.PARKING,
    EXPENSE_TYPE.OTHER,
  ];

  ngOnInit() {
    this.registryService.getExpenses();
  }

  add() {
    this.popupService.showPopup();
    this.popupService.setFlag(POPUP_TYPE.ADD);
  }

  deleteAll() {
    this.popupService.showPopup();
    this.popupService.setFlag(POPUP_TYPE.DELETE);
  }

  filter() {
    this.registryService.changeFilters(this.expensesFilters);
    //this.registryService.getExpenses();
  }

  checkboxChange(type: ExpenseType) {
    if (this.expensesFilters.includes(type))
      this.expensesFilters.splice(
        this.expensesFilters.findIndex((o) => o === type),
        1
      );
    else this.expensesFilters.push(type);
  }
}
