import { Component, inject } from '@angular/core';
import { ExpenseCardComponent } from '../expense-card/expense-card.component';
import { DxLoadIndicatorModule, DxScrollViewModule } from 'devextreme-angular';
import { RegistryStateService } from '../../services/registry-state.service';
import { AsyncPipe } from '@angular/common';

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
  private registryService = inject(RegistryStateService);
  list$ = this.registryService.expensesList$;

  ngOnInit() {
    this.registryService.getExpenses();
  }
}
