import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCarFormComponent } from './popup-car-form.component';

describe('PopupCarFormComponent', () => {
  let component: PopupCarFormComponent;
  let fixture: ComponentFixture<PopupCarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupCarFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
