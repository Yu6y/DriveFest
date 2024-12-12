import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupExpenseFormComponent } from './popup-expense-form.component';

describe('PopupExpenseFormComponent', () => {
  let component: PopupExpenseFormComponent;
  let fixture: ComponentFixture<PopupExpenseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupExpenseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
