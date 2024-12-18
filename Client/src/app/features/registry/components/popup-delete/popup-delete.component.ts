import { Component, inject, Input } from '@angular/core';
import { POPUP_TYPE, PopupType } from '../../../../shared/models/PopupType';
import { NonNullableFormBuilder } from '@angular/forms';
import { RegistryStateService } from '../../services/registry-state.service';
import { PopupService } from '../../../../shared/services/popup.service';

@Component({
  selector: 'app-popup-delete',
  standalone: true,
  imports: [],
  templateUrl: './popup-delete.component.html',
  styleUrl: './popup-delete.component.scss',
})
export class PopupDeleteComponent {
  @Input() flag!: PopupType;
  private registryService = inject(RegistryStateService);
  private popupService = inject(PopupService);

  dataId!: number;

  ngOnInit() {
    if (this.flag === POPUP_TYPE.DELETE) {
      this.popupService.popupData$.subscribe((res) => {
        if (res) this.dataId = res.id;
        else this.dataId = -1;
      });
    } else if (this.flag === POPUP_TYPE.DELETECAR) {
      this.popupService.popupCar$.subscribe((res) => {
        if (res) this.dataId = res.id;
      });
    }
  }

  submit() {
    if (this.flag === POPUP_TYPE.DELETE) {
      if (this.dataId !== -1) this.registryService.deleteExpense(this.dataId);
      else this.registryService.deleteAllExpenses();
    } else if (this.flag === POPUP_TYPE.DELETECAR) {
      this.registryService.deleteCar(this.dataId);
    } else if (this.flag === POPUP_TYPE.DELETEREGISTRY) {
      this.registryService.deleteCarRegistry();
    }

    this.close();
  }

  close() {
    this.popupService.closePopup();
  }
}
