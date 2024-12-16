import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsListComponent } from './cars-list.component';
import { RegistryStateService } from '../../services/registry-state.service';

describe('CarsListComponent', () => {
  let component: CarsListComponent;
  let fixture: ComponentFixture<CarsListComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj("RegistryStateService", {loadCars: null})
    await TestBed.configureTestingModule({
      imports: [CarsListComponent],
      providers: [
        {
          provide: RegistryStateService,
          useValue: api
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
