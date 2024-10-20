import { Component, inject, Input } from '@angular/core';
import { EventShort } from '../../models/EventShort';
import { EventCardComponent } from '../../../features/events/components/event-card/event-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [EventCardComponent],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
})
export class CardsListComponent {
  @Input() events: EventShort[] | null = [];
  private router = inject(Router);

  eventClick(id: number) {
    this.router.navigate(['/event', id]);
  }
}
