import { Component, inject } from '@angular/core';
import { LinearListComponent } from '../linear-list/linear-list.component';
import { DxLoadIndicatorModule } from 'devextreme-angular';

@Component({
  selector: 'app-workshops-list-page',
  standalone: true,
  imports: [LinearListComponent, DxLoadIndicatorModule],
  templateUrl: './workshops-list-page.component.html',
  styleUrl: './workshops-list-page.component.scss',
})
export class WorkshopsListPageComponent {
  flag: 'workshops' = 'workshops';
}
