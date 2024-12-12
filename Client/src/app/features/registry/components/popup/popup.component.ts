import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DxPopupModule } from 'devextreme-angular';
import { Observable } from 'rxjs';
import { PopupService } from '../../../../shared/services/popup.service';
import { AsyncPipe } from '@angular/common';
import { POPUP_TYPE, PopupType } from '../../../../shared/models/PopupType';
import { EXPENSE_TYPE } from '../../../../shared/models/ExpenseType';
import { PopupCarFormComponent } from '../popup-car-form/popup-car-form.component';
import { PopupDeleteComponent } from '../popup-delete/popup-delete.component';
import { PopupRegistryFormComponent } from '../popup-registry-form/popup-registry-form.component';
import { PopupExpenseFormComponent } from '../popup-expense-form/popup-expense-form.component';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    DxPopupModule,
    ReactiveFormsModule,
    AsyncPipe,
    PopupCarFormComponent,
    PopupDeleteComponent,
    PopupExpenseFormComponent,
    PopupRegistryFormComponent,
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  private popupService = inject(PopupService);
  protected flags = POPUP_TYPE;
  protected expenseTypes = EXPENSE_TYPE;

  combined$!: Observable<{
    isVisible: boolean;
    flag: PopupType;
  }>;

  ngOnInit() {
    this.combined$ = this.popupService.combinedConditions$;
  }

  close() {
    this.popupService.closePopup();
  }
}
