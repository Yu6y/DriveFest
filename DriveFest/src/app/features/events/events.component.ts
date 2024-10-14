import { Component, Input } from '@angular/core';
import { CardsListComponent } from '../../shared/components/cards-list/cards-list.component';
import { EventShort } from '../../shared/models/EventShort';
import { EventFiltersComponent } from './components/event-filters/event-filters.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CardsListComponent, EventFiltersComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  cos: string = 'dwada';

  tab: EventShort[] = [
    {
      id: 0,
      name: 'Eevnt',
      image: 'dwadwad',
      date: 'dwadwad',
      location: 'dwaadw',
      followersCount: 4,
      voivodeship: 'dwadwa',
      tags: [{ id: 1, name: 'dwada' }],
      isFavorite: true,
    },
    {
      id: 0,
      name: 'dwadwwdwa',
      image: 'dwadwad',
      date: 'dwadwad',
      location: 'dwaadw',
      followersCount: 4,
      voivodeship: 'dwadwa',
      tags: [{ id: 1, name: 'dwada' }],
      isFavorite: true,
    },
  ];
}
