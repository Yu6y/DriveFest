import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Expense } from '../models/Expense';
import { POPUP_TYPE, PopupType } from '../models/PopupType';
import { CarRegistry } from '../models/CarRegistry';
import { Car } from '../models/Car';
import { height } from '@fortawesome/free-solid-svg-icons/faStar';

export type PopupSettings = {
  width: number;
  height: number;
  title: string;
};

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
  private popupSettingsSubject$ = new BehaviorSubject<PopupSettings>({
    width: 0,
    height: 0,
    title: '',
  });

  popupData$ = this.popupDataSubject$.asObservable();
  popupRegistryData$ = this.popupRegistryDataSubject$.asObservable();
  popupCar$ = this.popupCarSubject$.asObservable();

  combinedConditions$ = combineLatest([
    this.popupSubject$,
    this.popupFlagSubject$,
    this.popupSettingsSubject$,
  ]).pipe(
    map(([isVisible, flag, settings]) => ({
      isVisible,
      flag,
      settings,
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
    this.popupSettingsSubject$.next(this.getPopupSettings(flag));
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

  getPopupSettings(flag: PopupType): PopupSettings {
    console.log(flag);
    if (flag === POPUP_TYPE.ADD || flag === POPUP_TYPE.EDIT)
      return {
        height: 500,
        width: 500,
        title: 'Wydatek',
      };
    else if (
      flag === POPUP_TYPE.DELETE ||
      flag === POPUP_TYPE.DELETEREGISTRY ||
      flag === POPUP_TYPE.DELETECAR
    )
      return {
        height: 180,
        width: 400,
        title: 'Chcesz kontynuować?',
      };
    else if (flag === POPUP_TYPE.EDITREGISTRY)
      return {
        height: 480,
        width: 500,
        title: 'Dziennik',
      };
    else if (flag === POPUP_TYPE.ADDCAR || flag === POPUP_TYPE.EDITCAR)
      return {
        height: 280,
        width: 500,
        title: 'Pojazd',
      };
    else
      return {
        height: 200,
        width: 200,
        title: '6196',
      };
  }
}
