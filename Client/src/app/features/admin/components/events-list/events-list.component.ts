import { Component, inject, Input } from '@angular/core';
import {
  EventListCardComponent,
  outputTypes,
} from '../event-list-card/event-list-card.component';
import { AdminStateService } from '../../services/admin-state.service';
import { AdminEvent } from '../../../../shared/models/AdminEvent';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [EventListCardComponent],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.scss',
})
export class EventsListComponent {
  @Input({ required: true }) list!: AdminEvent[];
  private adminService = inject(AdminStateService);
  private router = inject(Router);

  handleOutput(action: outputTypes) {
    if (action.type === 'event') {
      this.moveToEvent(action.id);
    } else if (action.type === 'accept') this.acceptEvent(action.id);
    else if (action.type === 'delete') this.deleteEvent(action.id);
    else if (action.type === 'edit') this.editEvent(action.id);
  }

  moveToEvent(id: number) {
    this.router.navigate([`event/${id}`]);
  }

  acceptEvent(id: number) {
    this.adminService.acceptEvent(id);
  }

  deleteEvent(id: number) {
    this.adminService.deleteEvent(id);
  }

  editEvent(id: number) {
    this.router.navigate(['admin/edit-event'], {
      state: { id: id },
    });
  }
}
