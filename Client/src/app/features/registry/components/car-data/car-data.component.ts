import { Component, HostListener, inject } from '@angular/core';
import { DxScrollViewModule } from 'devextreme-angular';
import { ExpensesListComponent } from '../expenses-list/expenses-list.component';
import { MatIconModule } from '@angular/material/icon';
import { CarRegistryComponent } from '../car-registry/car-registry.component';
import { ExpensesChartComponent } from '../expenses-chart/expenses-chart.component';
import { RegistryStateService } from '../../services/registry-state.service';
import { ActivatedRoute } from '@angular/router';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-car-data',
  standalone: true,
  imports: [
    MatIconModule,
    ExpensesListComponent,
    DxScrollViewModule,
    CarRegistryComponent,
    ExpensesChartComponent,
    PopupComponent,
  ],
  templateUrl: './car-data.component.html',
  styleUrl: './car-data.component.scss',
})
export class CarDataComponent {
  private registryService = inject(RegistryStateService);
  private route = inject(ActivatedRoute);
  isLargeScreen: boolean = window.innerWidth >= 992;

  ngOnInit() {
    this.isLargeScreen = window.innerWidth >= 992;
    this.registryService.setCarId(+this.route.snapshot.params['id']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = event.target.innerWidth >= 992;
  }
}
