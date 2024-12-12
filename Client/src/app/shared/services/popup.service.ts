import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Expense } from '../models/Expense';
import { POPUP_TYPE, PopupType } from '../models/PopupType';
import { CarRegistry } from '../models/CarRegistry';
import { Car } from '../models/Car';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private popupSubject$ = new BehaviorSubject<boolean>(false);
  private popupFlagSubject$ = new BehaviorSubject<PopupType>(
    POPUP_TYPE.DEFAULT
  );
  private popupDataSubject$ = new BehaviorSubject<Expense | null>(null);
  private popupRegistryDataSubject$ = new BehaviorSubject<CarRegistry | null>(
    null
  );
  private popupCarSubject$ = new BehaviorSubject<Car | null>(null);

  popupData$ = this.popupDataSubject$.asObservable();
  popupRegistryData$ = this.popupRegistryDataSubject$.asObservable();
  popupCar$ = this.popupCarSubject$.asObservable();

  combinedConditions$ = combineLatest([
    this.popupSubject$,
    this.popupFlagSubject$,
  ]).pipe(
    map(([isVisible, flag]) => ({
      isVisible,
      flag,
    }))
  );

  showPopup() {
    this.popupSubject$.next(true);
  }

  closePopup() {
    this.popupSubject$.next(false);
    this.clearData();
  }

  setFlag(flag: PopupType) {
    this.popupFlagSubject$.next(flag);
  }

  setData(data: Expense) {
    this.popupDataSubject$.next(data);
  }

  setRegistryData(data: CarRegistry) {
    this.popupRegistryDataSubject$.next(data);
  }

  setCarData(car: Car) {
    this.popupCarSubject$.next(car);
  }

  clearData() {
    this.popupDataSubject$.next(null);
    this.popupRegistryDataSubject$.next(null);
    this.popupCarSubject$.next(null);
    this.popupFlagSubject$.next(POPUP_TYPE.DEFAULT);
  }
}
