import { Injectable } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Expense } from '../models/Expense';
import { POPUP_TYPE, PopupType } from '../models/PopupType';
import { CarRegistry } from '../models/CarRegistry';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private popupSubject$ = new BehaviorSubject<boolean>(false);
  private popupFlagSubject$ = new BehaviorSubject<PopupType>(POPUP_TYPE.ADD);
  private popupDataSubject$ = new BehaviorSubject<Expense | null>(null);
  private popupRegistryDataSubject$ = new BehaviorSubject<CarRegistry | null>(
    null
  );
  public popup$ = this.popupSubject$.asObservable();
  public flag$ = this.popupFlagSubject$.asObservable();
  public data$ = this.popupDataSubject$.asObservable();
  public registryData$ = this.popupRegistryDataSubject$.asObservable();

  combinedConditions$ = combineLatest([
    this.popupSubject$,
    this.popupFlagSubject$,
    this.popupDataSubject$,
    this.popupRegistryDataSubject$,
  ]).pipe(
    map(([isVisible, flag, data, registry]) => ({
      isVisible,
      flag,
      data,
      registry,
    }))
  );

  showPopup() {
    this.popupSubject$.next(true);
  }

  closePopup() {
    this.popupSubject$.next(false);
    this.popupFlagSubject$.next(POPUP_TYPE.ADD);
    console.log('usun dane');
    this.popupDataSubject$.next(null);
  }

  setFlag(flag: PopupType) {
    this.popupFlagSubject$.next(flag);
  }

  setData(data: Expense | null) {
    console.log(data);
    this.popupDataSubject$.next(data);
  }

  setRegistryData(data: CarRegistry | null) {
    this.popupRegistryDataSubject$.next(data);
  }
}
