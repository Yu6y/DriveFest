import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupComponent } from './popup.component';
import { of } from 'rxjs';
import { POPUP_TYPE } from '../../../../shared/models/PopupType';
import { height } from '@fortawesome/free-solid-svg-icons/faStar';
import { By } from '@angular/platform-browser';
import { RegistryStateService } from '../../services/registry-state.service';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('RegistryStateService', ['']);
    await TestBed.configureTestingModule({
      imports: [PopupComponent],
      providers: [
        {
          provide: RegistryStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display popup', () => {
    component.combined$ = of({
      isVisible: true,
      flag: POPUP_TYPE.ADD,
      settings: {
        height: 0,
        width: 0,
        title: '',
      },
    });

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('app-popup-expense-form'))
    ).toBeTruthy();
  });
});
