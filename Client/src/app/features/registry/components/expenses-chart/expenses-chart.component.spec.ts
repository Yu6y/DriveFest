import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesChartComponent } from './expenses-chart.component';
import { RegistryStateService } from '../../services/registry-state.service';

describe('ExpensesChartComponent', () => {
  let component: ExpensesChartComponent;
  let fixture: ComponentFixture<ExpensesChartComponent>;

  beforeEach(async () => {
    let api = jasmine.createSpyObj('RegistryStateService', ['']);
    await TestBed.configureTestingModule({
      imports: [ExpensesChartComponent],
      providers: [
        {
          provide: RegistryStateService,
          useValue: api,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
