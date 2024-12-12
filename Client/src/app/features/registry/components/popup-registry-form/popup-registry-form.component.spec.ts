import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupRegistryFormComponent } from './popup-registry-form.component';

describe('PopupRegistryFormComponent', () => {
  let component: PopupRegistryFormComponent;
  let fixture: ComponentFixture<PopupRegistryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupRegistryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupRegistryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
