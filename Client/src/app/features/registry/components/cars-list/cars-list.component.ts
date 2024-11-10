import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CarCardComponent } from '../car-card/car-card.component';
import { RegistryStateService } from '../../services/registry-state.service';
import { Car } from '../../../../shared/models/Car';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DxLoadIndicatorModule } from 'devextreme-angular';
import { PopupService } from '../../../../shared/services/popup.service';
import { POPUP_TYPE } from '../../../../shared/models/PopupType';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cars-list',
  standalone: true,
  imports: [MatIconModule, CarCardComponent, AsyncPipe, DxLoadIndicatorModule],
  templateUrl: './cars-list.component.html',
  styleUrl: './cars-list.component.scss',
})
export class CarsListComponent {
  private registryService = inject(RegistryStateService);
  private popupService = inject(PopupService);
  private router = inject(Router);
  carsList$!: Observable<LoadingState<Car[]>>;

  ngOnInit() {
    this.registryService.loadCars();
    this.carsList$ = this.registryService.carsList$;
  }

  iconClick(event: string, value: Car) {
    if (event === 'edit') this.popupService.setFlag(POPUP_TYPE.EDITCAR);
    else if (event === 'delete')
      this.popupService.setFlag(POPUP_TYPE.DELETECAR);

    this.popupService.setCarData(value);
    this.popupService.showPopup();
  }

  addCar() {
    this.popupService.setFlag(POPUP_TYPE.ADDCAR);
    this.popupService.showPopup();
  }

  moveToRegistry(id: number) {
    this.router.navigate([`registry/${id}`]);
  }
}
