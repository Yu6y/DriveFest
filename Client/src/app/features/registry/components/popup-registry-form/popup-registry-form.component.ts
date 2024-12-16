import { Component, inject, Input } from '@angular/core';
import { POPUP_TYPE, PopupType } from '../../../../shared/models/PopupType';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegistryStateService } from '../../services/registry-state.service';
import { PopupService } from '../../../../shared/services/popup.service';
import { FormValue } from '../../../../shared/utils/FromValue';

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
  selector: 'app-popup-registry-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './popup-registry-form.component.html',
  styleUrl: './popup-registry-form.component.scss',
})
export class PopupRegistryFormComponent {
  @Input() flag!: PopupType;
  private formBuilder = inject(NonNullableFormBuilder);
  private registryService = inject(RegistryStateService);
  private popupService = inject(PopupService);

  registryData$ = this.popupService.popupRegistryData$;

  registryForm: EditRegistryForm = this.formBuilder.group({
    course: this.formBuilder.control<string>('', [
      Validators.required,
      Validators.pattern(/^(0|[1-9]\d{0,6})$/),
    ]),
    insurance: this.formBuilder.control<string | null>(null),
    tech: this.formBuilder.control<string | null>(null),
    engineOil: this.formBuilder.control<string>('', [
      Validators.required,
      Validators.pattern(/^(0|[1-9]\d{0,6})$/),
    ]),
    transmissionOil: this.formBuilder.control<string>('', [
      Validators.required,
      Validators.pattern(/^(0|[1-9]\d{0,6})$/),
    ]),
    brakes: this.formBuilder.control<string>('', [
      Validators.required,
      Validators.pattern(/^(0|[1-9]\d{0,6})$/),
    ]),
  });

  ngOnInit() {
    if (this.flag === POPUP_TYPE.EDITREGISTRY) {
      this.registryData$.subscribe((res) => {
        if (res) {
          this.registryForm.patchValue({
            course: res.course,
            insurance: res.insurance ? res.insurance : null,
            tech: res.tech ? res.tech : null,
            engineOil: res.engineOil,
            transmissionOil: res.transmissionOil,
            brakes: res.brakes,
          });
        }
      });
    }
  }

  submit() {
    if (this.registryForm.valid) {
      if (this.flag === POPUP_TYPE.EDITREGISTRY)
        this.registryService.editRegistry(this.registryForm.getRawValue());
    }

    this.close();
  }

  close() {
    this.popupService.closePopup();
  }
}
