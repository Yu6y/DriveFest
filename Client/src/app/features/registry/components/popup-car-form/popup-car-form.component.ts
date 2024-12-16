import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValue } from '../../../../shared/utils/FromValue';
import { PopupService } from '../../../../shared/services/popup.service';
import { RegistryStateService } from '../../services/registry-state.service';
import { POPUP_TYPE, PopupType } from '../../../../shared/models/PopupType';
import { concatMap, of } from 'rxjs';

type EditCarForm = FormGroup<{
  name: FormControl<string>;
  photoURL: FormControl<File | null>;
}>;

export type EditCarFormValue = FormValue<EditCarForm>;

@Component({
  selector: 'app-popup-car-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './popup-car-form.component.html',
  styleUrl: './popup-car-form.component.scss',
})
export class PopupCarFormComponent {
  @Input() flag!: PopupType;
  private formBuilder = inject(NonNullableFormBuilder);
  private registryService = inject(RegistryStateService);
  private popupService = inject(PopupService);

  carData$ = this.popupService.popupCar$;
  carId!: number;
  carForm: EditCarForm = this.formBuilder.group({
    name: this.formBuilder.control<string>('', [
      Validators.required,
      Validators.maxLength(25),
    ]),
    photoURL: this.formBuilder.control<File | null>(null),
  });

  ngOnInit() {
    console.log('243453453');
    if (this.flag === POPUP_TYPE.EDITCAR) {
      this.carData$
        .pipe(
          concatMap((res) => {
            return of(res);
          })
        )
        .subscribe((res) => {
          if (res) {
            this.carId = res.id;
            this.carForm.patchValue({
              name: res.name,
            });
          }
        });
    }
  }

  submit() {
    if (this.carForm.valid) {
      if (this.flag === POPUP_TYPE.ADDCAR)
        this.registryService.addCar(this.carForm.getRawValue());
      else if (this.flag === POPUP_TYPE.EDITCAR)
        this.registryService.editCar(
          this.carForm.getRawValue(),
          this.carId.toString()
        );
    }

    this.close();
  }

  sendPhoto(event: any) {
    this.carForm.patchValue({
      photoURL: event.target.files[0],
    });
  }

  close() {
    this.carForm.reset();
    this.popupService.closePopup();
  }
}
