import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExpensesListComponent } from './components/expenses-list/expenses-list.component';
import {
  DxPopupModule,
  DxScrollViewComponent,
  DxScrollViewModule,
} from 'devextreme-angular';
import { PopupComponent } from './components/popup/popup.component';

@Component({
  selector: 'app-registry',
  standalone: true,
  imports: [
    MatIconModule,
    ExpensesListComponent,
    DxScrollViewModule,
    PopupComponent,
  ],
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss',
})
export class RegistryComponent {
  isPopupVisible: boolean = false;

  showPopup() {
    this.isPopupVisible = true;
  }

  hidePopup() {
    this.isPopupVisible = false;
  }
}
