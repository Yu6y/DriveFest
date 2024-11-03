import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DxPopupModule } from 'devextreme-angular';
import { FormValue } from '../../../../shared/utils/FromValue';
import { RegistryStateService } from '../../services/registry-state.service';
import { Observable } from 'rxjs';
import { PopupService } from '../../../../shared/services/popup.service';
import { AsyncPipe } from '@angular/common';
import { Expense } from '../../../../shared/models/Expense';
import { POPUP_TYPE, PopupType } from '../../../../shared/models/PopupType';
import { EXPENSE_TYPE } from '../../../../shared/models/ExpenseType';
import { CarRegistry } from '../../../../shared/models/CarRegistry';
import { transform } from 'typescript';

type AddExpenseForm = FormGroup<{
  type: FormControl<string>;
  price: FormControl<number>;
  date: FormControl<string>;
  description: FormControl<string>;
}>;

export type AddExpenseFormValue = FormValue<AddExpenseForm>;

type EditRegistryForm = FormGroup<{
  course: FormControl<string>;
  insurance: FormControl<string | null>;
  tech: FormControl<string | null>;
  engineOil: FormControl<string>;
  transmissionOil: FormControl<string>;
  brakes: FormControl<string>;
}>;

export type EditRegistryFromValue = FormValue<EditRegistryForm>;

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [DxPopupModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  private formBuilder = inject(NonNullableFormBuilder);
  private registryService = inject(RegistryStateService);
  private popupService = inject(PopupService);
  protected flags = POPUP_TYPE;
  protected expenseTypes = EXPENSE_TYPE;
  combined$!: Observable<{
    isVisible: boolean;
    flag: PopupType;
    data: Expense | null;
    registry: CarRegistry | null;
  }>;
  flag!: PopupType;
  data: Expense | null = null;

  expenseForm: AddExpenseForm = this.formBuilder.group({
    type: this.formBuilder.control<string>(
      this.expenseTypes.FUEL,
      Validators.required
    ),
    date: this.formBuilder.control<string>('', Validators.required),
    price: this.formBuilder.control<number>(0, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^(0|[1-9]\d*)(\.\d{1,2})?$/),
    ]),
    description: this.formBuilder.control<string>('', Validators.required),
  });

  registryForm: EditRegistryForm = this.formBuilder.group({
    course: this.formBuilder.control<string>('', [
      Validators.required,
      Validators.pattern(/^0|[1-9]\d*$/),
    ]),
    insurance: this.formBuilder.control<string | null>(null),
    tech: this.formBuilder.control<string | null>(null),
    engineOil: this.formBuilder.control<string>('', [
      Validators.required,
      Validators.pattern(/^0|[1-9]\d*$/),
    ]),
    transmissionOil: this.formBuilder.control<string>('', [
      Validators.required,
      Validators.pattern(/^0|[1-9]\d*$/),
    ]),
    brakes: this.formBuilder.control<string>('', [
      Validators.required,
      Validators.pattern(/^0|[1-9]\d*$/),
    ]),
  });

  ngOnInit() {
    this.combined$ = this.popupService.combinedConditions$;

    this.combined$.subscribe((res) => {
      this.flag = res.flag;
      if (res.data && this.flag === POPUP_TYPE.EDIT) {
        console.log('edit');
        this.expenseForm.patchValue({
          type: res.data.type,
          date: res.data.date,
          price: res.data.price,
          description: res.data.description,
        });
        this.data = res.data;
      }
      if (res.registry && this.flag === POPUP_TYPE.EDITREGISTRY) {
        console.log('edit');
        this.registryForm.patchValue({
          course: res.registry.course,
          insurance: res.registry.insurance ? res.registry.insurance : null,
          tech: res.registry.tech ? res.registry.tech : null,
          engineOil: res.registry.engineOil,
          transmissionOil: res.registry.transmissionOil,
          brakes: res.registry.brakes,
        });
      }
    });
  }

  submit() {
    if (this.expenseForm.valid && this.flag === POPUP_TYPE.ADD) {
      this.registryService.addExpense(this.expenseForm.getRawValue());
    } else if (this.flag === POPUP_TYPE.DELETE) {
      if (this.data) this.registryService.deleteExpense(this.data.id);
      else this.registryService.deleteAllExpenses();
    } else if (this.flag === POPUP_TYPE.DELETEREGISTRY) {
      this.registryService.deleteCarRegistry();
    } else if (this.expenseForm.valid && this.flag === POPUP_TYPE.EDIT) {
      this.registryService.editExpense(
        this.data!.id,
        this.expenseForm.getRawValue()
      );
      this.popupService.setData(null);
    } else if (this.flag === POPUP_TYPE.EDITREGISTRY) {
      this.registryService.editRegistry(this.registryForm.getRawValue());
      this.popupService.setRegistryData(null);
    }
    this.closePopup();
  }

  close() {
    console.log('click');
    this.expenseForm.reset();
    this.popupService.closePopup();
  }

  closePopup() {
    this.expenseForm.reset();
    this.popupService.closePopup();
  }
}
