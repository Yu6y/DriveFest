import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EventShort } from '../../../../shared/models/EventShort';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  @Input({ required: true }) event!: EventShort;
  @Output() follow = new EventEmitter<EventShort>();
}
