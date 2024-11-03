import { Component, inject } from '@angular/core';
import { PopupService } from '../../../../shared/services/popup.service';
import { POPUP_TYPE } from '../../../../shared/models/PopupType';
import { RegistryStateService } from '../../services/registry-state.service';
import { Observable } from 'rxjs';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { CarRegistry } from '../../../../shared/models/CarRegistry';
import { ChartSeriesAggregationMethod } from 'devextreme/viz/chart';
import { AsyncPipe } from '@angular/common';
import { DxLoadIndicatorModule } from 'devextreme-angular';

@Component({
  selector: 'app-car-registry',
  standalone: true,
  imports: [AsyncPipe, DxLoadIndicatorModule],
  templateUrl: './car-registry.component.html',
  styleUrl: './car-registry.component.scss',
})
export class CarRegistryComponent {
  private popupService = inject(PopupService);
  private registryService = inject(RegistryStateService);
  data!: CarRegistry;
  registry$!: Observable<LoadingState<CarRegistry>>;

  ngOnInit() {
    this.registryService.getCarRegistry();
    this.registry$ = this.registryService.registry$;
    this.registry$.subscribe((res) => {
      if (res.state === 'success') this.data = res.data;
    });
  }

  edit() {
    this.popupService.setFlag(POPUP_TYPE.EDITREGISTRY);
    this.popupService.setRegistryData(this.data);
    this.popupService.showPopup();
  }

  clear() {
    this.popupService.setFlag(POPUP_TYPE.DELETEREGISTRY);
    this.popupService.showPopup();
  }
}
