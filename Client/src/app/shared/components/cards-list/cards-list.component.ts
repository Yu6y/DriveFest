import { Component, Input } from '@angular/core';
import { EventShort } from '../../models/EventShort';
import { EventCardComponent } from '../../../features/events/components/event-card/event-card.component';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [EventCardComponent],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
})
export class CardsListComponent {
  @Input() tab!: EventShort[];
}
