import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExpensesListComponent } from './components/expenses-list/expenses-list.component';
import {
  DxPopupModule,
  DxScrollViewComponent,
  DxScrollViewModule,
} from 'devextreme-angular';
import { PopupComponent } from './components/popup/popup.component';
import { PopupService } from '../../shared/services/popup.service';
import { POPUP_TYPE } from '../../shared/models/PopupType';
import { CarRegistryComponent } from './components/car-registry/car-registry.component';
import { ExpensesChartComponent } from './components/expenses-chart/expenses-chart.component';

@Component({
  selector: 'app-registry',
  standalone: true,
  imports: [
    MatIconModule,
    ExpensesListComponent,
    DxScrollViewModule,
    PopupComponent,
    CarRegistryComponent,
    ExpensesChartComponent,
  ],
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss',
})
export class RegistryComponent {
  isLargeScreen: boolean = window.innerWidth >= 992;

  ngOnInit() {
    this.isLargeScreen = window.innerWidth >= 992;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = event.target.innerWidth >= 992;
  }
}