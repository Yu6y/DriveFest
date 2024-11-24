import { Component, inject } from '@angular/core';
import { EventListCardComponent } from '../event-list-card/event-list-card.component';
import { EventsListComponent } from '../events-list/events-list.component';
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
  selector: 'app-events-list-page',
  standalone: true,
  imports: [EventsListComponent, AsyncPipe, DxLoadIndicatorModule],
  templateUrl: './events-list-page.component.html',
  styleUrl: './events-list-page.component.scss',
})
export class EventsListPageComponent {
  private adminState = inject(AdminStateService);

  list$!: Observable<LoadingState<AdminEvent[]>>;

  ngOnInit() {
    this.list$ = this.adminState.eventsList$;
    this.adminState.loadEventsList();
  }
}
