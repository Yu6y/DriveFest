import { Component, inject } from '@angular/core';
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
  private expensesFilters: ExpenseType[] = [
    EXPENSE_TYPE.FUEL,
    EXPENSE_TYPE.SERVICE,
    EXPENSE_TYPE.PARKING,
    EXPENSE_TYPE.OTHER,
  ];
  private selectedFilters: ExpenseType[] = [...this.expensesFilters];

  ngOnInit() {
    this.registryService.prepareReg();
  }

  add() {
    this.popupService.setFlag(POPUP_TYPE.ADD);
    this.popupService.showPopup();
  }

  deleteAll() {
    this.popupService.setFlag(POPUP_TYPE.DELETE);
    this.popupService.showPopup();
  }

  filter() {
    this.expensesFilters = [...this.selectedFilters];
    this.registryService.changeFilters(this.expensesFilters);
  }

  checkboxChange(type: ExpenseType) {
    if (this.selectedFilters.includes(type))
      this.selectedFilters = this.selectedFilters.filter((t) => t !== type);
    else this.selectedFilters.push(type);
  }
}
