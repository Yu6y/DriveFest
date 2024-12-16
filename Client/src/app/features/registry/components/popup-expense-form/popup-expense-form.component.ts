import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValue } from '../../../../shared/utils/FromValue';
import { RegistryStateService } from '../../services/registry-state.service';
import { PopupService } from '../../../../shared/services/popup.service';
import { EXPENSE_TYPE } from '../../../../shared/models/ExpenseType';
import { POPUP_TYPE, PopupType } from '../../../../shared/models/PopupType';

type AddExpenseForm = FormGroup<{
  type: FormControl<string>;
  price: FormControl<number>;
  date: FormControl<string>;
  description: FormControl<string>;
}>;

export type AddExpenseFormValue = FormValue<AddExpenseForm>;

@Component({
  selector: 'app-popup-expense-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './popup-expense-form.component.html',
  styleUrl: './popup-expense-form.component.scss',
})
export class PopupExpenseFormComponent {
  @Input() flag!: PopupType;
  private formBuilder = inject(NonNullableFormBuilder);
  private registryService = inject(RegistryStateService);
  private popupService = inject(PopupService);
  protected expenseTypes = EXPENSE_TYPE;

  expenseData$ = this.popupService.popupData$;
  expenseId!: number;

  expenseForm: AddExpenseForm = this.formBuilder.group({
    type: this.formBuilder.control<string>(
      this.expenseTypes.FUEL,
      Validators.required
    ),
    date: this.formBuilder.control<string>('', Validators.required),
    price: this.formBuilder.control<number>(0, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^(0|[1-9]\d{0,9})(\.\d{1,2})?$/),
    ]),
    description: this.formBuilder.control<string>('', Validators.required),
  });

  ngOnInit() {
    console.log('213');
    if (this.flag === POPUP_TYPE.EDIT) {
      this.expenseData$.subscribe((res) => {
        if (res) {
          this.expenseId = res.id;
          this.expenseForm.patchValue({
            type: res.type,
            date: res.date,
            price: res.price,
            description: res.description,
          });
        }
      });
    }
  }

  submit() {
    if (this.expenseForm.valid) {
      if (this.flag === POPUP_TYPE.ADD)
        this.registryService.addExpense(this.expenseForm.getRawValue());
      else if (this.flag === POPUP_TYPE.EDIT) {
        this.registryService.editExpense(
          this.expenseId,
          this.expenseForm.getRawValue()
        );
      }
    }

    this.close();
  }

  close() {
    this.expenseForm.reset();
    this.popupService.closePopup();
  }
}
