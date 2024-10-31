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

type AddExpenseForm = FormGroup<{
  type: FormControl<string>;
  price: FormControl<number>;
  date: FormControl<string>;
  description: FormControl<string>;
}>;

export type AddExpenseFormValue = FormValue<AddExpenseForm>;

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [DxPopupModule, ReactiveFormsModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  private formBuilder = inject(NonNullableFormBuilder);
  private registryService = inject(RegistryStateService);
  @Input() isVisible = false;
  @Output() onClose = new EventEmitter<void>();

  expenseForm: AddExpenseForm = this.formBuilder.group({
    type: this.formBuilder.control<string>('Tankowanie', Validators.required),
    date: this.formBuilder.control<string>('', Validators.required),
    price: this.formBuilder.control<number>(0, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^\d+\.{0,1}\d{1,2}$/),
    ]),
    description: this.formBuilder.control<string>('', Validators.required),
  });

  submit() {
    // if(this.expenseForm.valid)
    //   this.registryService.
  }

  close() {
    if (!this.isVisible) return;
    console.log('click');
    this.expenseForm.reset();
    this.isVisible = false;
    this.onClose.emit();
  }
}
