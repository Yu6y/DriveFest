import { Component, inject, Input } from '@angular/core';
import { CardsListComponent } from '../../shared/components/cards-list/cards-list.component';
import { EventShort } from '../../shared/models/EventShort';
import { EventFiltersComponent } from './components/event-filters/event-filters.component';
import { EventStateService } from './services/event-state.service';
import { Observable, skip } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CardsListComponent, EventFiltersComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  private dataService = inject(EventStateService);

  ngOnInit() {
    this.dataService.startEventList();
  }
}
