import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { EventShort } from '../../models/EventShort';
import { EventCardComponent } from '../../../features/events/components/event-card/event-card.component';
import { Router } from '@angular/router';
import { EventStateService } from '../../../features/events/services/event-state.service';

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
  private stateService = inject(EventStateService);

  eventClick(id: number) {
    this.router.navigate(['/event', id]);
  }

  eventFollowClick(event: EventShort) {
    this.stateService.handleEventFollow(event.id).subscribe((result) => {
      if (result) {
        if (event.isFavorite) event.followersCount--;
        else event.followersCount++;
        event.isFavorite = !event.isFavorite;
      }
    });
  }
}
