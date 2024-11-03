import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRegistryComponent } from './car-registry.component';

describe('CarRegistryComponent', () => {
  let component: CarRegistryComponent;
  let fixture: ComponentFixture<CarRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarRegistryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
