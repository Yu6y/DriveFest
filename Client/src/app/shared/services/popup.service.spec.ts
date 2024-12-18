import { TestBed } from '@angular/core/testing';

import { PopupService } from './popup.service';
import { POPUP_TYPE } from '../models/PopupType';
import { EXPENSE_TYPE } from '../models/ExpenseType';
import { Expense } from '../models/Expense';
import { Car } from '../models/Car';
import { CarRegistry } from '../models/CarRegistry';

describe('PopupService', () => {
  let service: PopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set popup', () => {
    service.showPopup();
    service.setFlag(POPUP_TYPE.ADD);

    service.combinedConditions$.subscribe((res) => {
      expect(res.isVisible).toBeTrue();
      expect(res.flag).toBe(POPUP_TYPE.ADD);
      expect(res.settings.height).toBe(500);
      expect(res.settings.width).toBe(500);
      expect(res.settings.title).toBe('Wydatek');
    });
  });

  it('should set data', () => {
    const expense: Expense = {
      id: 0,
      type: EXPENSE_TYPE.FUEL,
      price: 1000.99,
      date: '2023-10-11',
      description: 'desc',
    };

    service.setData(expense);

    service.popupData$.subscribe((res) => {
      expect(res?.id).toEqual(0);
      expect(res?.date).toBe('2023-10-11');
      expect(res?.price).toEqual(1000.99);
      expect(res?.description).toBe('desc');
      expect(res?.type).toBe(EXPENSE_TYPE.FUEL);
    });

    const car: Car = {
      id: 99,
      name: 'car',
      photoUrl: 'photo',
    };

    service.setCarData(car);

    service.popupCar$.subscribe((res) => {
      expect(res?.id).toEqual(99);
      expect(res?.name).toBe('car');
      expect(res?.photoUrl).toBe('photo');
    });

    const reg: CarRegistry = {
      course: '0',
      insurance: null,
      tech: '12',
      engineOil: '321',
      transmissionOil: '12',
      brakes: '0',
    };

    service.setRegistryData(reg);

    service.popupRegistryData$.subscribe((res) => {
      expect(res?.course).toBe('0');
      expect(res?.insurance).toBeNull();
      expect(res?.tech).toBe('12');
      expect(res?.engineOil).toBe('321');
      expect(res?.transmissionOil).toBe('12');
      expect(res?.brakes).toBe('0');
    });
  });
});
