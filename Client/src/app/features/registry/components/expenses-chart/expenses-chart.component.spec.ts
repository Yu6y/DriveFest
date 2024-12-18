import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesChartComponent } from './expenses-chart.component';
import { RegistryStateService } from '../../services/registry-state.service';
import { By } from '@angular/platform-browser';
import { ChartData } from '../../../../shared/models/ChartData';
import { of } from 'rxjs';
import { LoadingState } from '../../../../shared/models/LoadingState';

describe('ExpensesChartComponent', () => {
  let component: ExpensesChartComponent;
  let fixture: ComponentFixture<ExpensesChartComponent>;
  let api: jasmine.SpyObj<any>;

  beforeEach(async () => {
    api = jasmine.createSpyObj('RegistryStateService', [
      'setYear',
      'getChartData',
    ]);
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

  it('should display data', () => {
    const data = {
      currYear: '2024',
      chart: { state: 'success', data: [] } as LoadingState<ChartData[]>,
      desc: [],
      years: ['2024'],
    };

    component.dataCombined$ = of(data);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('dx-chart'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('select'))).toBeTruthy();
  });
});
