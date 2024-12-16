import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupExpenseFormComponent } from './popup-expense-form.component';
import { RegistryStateService } from '../../services/registry-state.service';

describe('PopupExpenseFormComponent', () => {
  let component: PopupExpenseFormComponent;
  let fixture: ComponentFixture<PopupExpenseFormComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('RegistryStateService', ['cos']);
    await TestBed.configureTestingModule({
      imports: [PopupExpenseFormComponent],
      providers: [
        {
          provide: RegistryStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
