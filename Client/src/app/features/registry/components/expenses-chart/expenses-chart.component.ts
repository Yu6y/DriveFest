import { Component, inject } from '@angular/core';
import { DxChartModule, DxLoadIndicatorModule } from 'devextreme-angular';
import { DxoValueAxisModule } from 'devextreme-angular/ui/nested';
import { RegistryStateService } from '../../services/registry-state.service';
import { Observable } from 'rxjs';
import { ChartData } from '../../../../shared/models/ChartData';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseDescription } from '../../../../shared/models/ExpenseDesc';

@Component({
  selector: 'app-expenses-chart',
  standalone: true,
  imports: [
    DxChartModule,
    DxoValueAxisModule,
    AsyncPipe,
    DxLoadIndicatorModule,
    FormsModule,
  ],
  templateUrl: './expenses-chart.component.html',
  styleUrl: './expenses-chart.component.scss',
})
export class ExpensesChartComponent {
  private registryService = inject(RegistryStateService);

  dataCombined$!: Observable<{
    currYear: string;
    chart: LoadingState<ChartData[]>;
    desc: ExpenseDescription[];
    years: string[];
  }>;

  ngOnInit() {
    this.dataCombined$ = this.registryService.combinedConditions$;
  }

  changeYear(year: Event) {
    this.registryService.setYear((year.target as HTMLSelectElement).value);
    this.registryService.getChartData();
  }
}
