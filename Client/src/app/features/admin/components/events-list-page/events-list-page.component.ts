import { Component } from '@angular/core';
import { LinearListComponent } from '../linear-list/linear-list.component';
import { DxLoadIndicatorModule } from 'devextreme-angular';

@Component({
  selector: 'app-linear-list-page',
  standalone: true,
  imports: [LinearListComponent, DxLoadIndicatorModule],
  templateUrl: './events-list-page.component.html',
  styleUrl: './events-list-page.component.scss',
})
export class EventsListPageComponent {
  flag: 'events' = 'events';
}
