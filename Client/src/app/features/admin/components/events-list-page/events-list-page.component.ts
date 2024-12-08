import { Component, inject } from '@angular/core';
import { EventListCardComponent } from '../event-list-card/event-list-card.component';
import { LinearListComponent } from '../linear-list/linear-list.component';
import { Observable } from 'rxjs';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { AdminEvent } from '../../../../shared/models/AdminEvent';
import { AdminStateService } from '../../services/admin-state.service';
import { AsyncPipe } from '@angular/common';
import {
  DxLoadIndicatorComponent,
  DxLoadIndicatorModule,
} from 'devextreme-angular';

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
