import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { EventShort } from '../../models/EventShort';
import { EventCardComponent } from '../../../features/events/components/event-card/event-card.component';
import { Router } from '@angular/router';
import { EventStateService } from '../../../features/events/services/event-state.service';
import { Observable } from 'rxjs';
import { LoadingState } from '../../models/LoadingState';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { AsyncPipe } from '@angular/common';
import { WorkshopShort } from '../../models/WorkshopShort';
import { WorkshopStateService } from '../../../features/workshops/services/workshop-state.service';
import { WorkshopCardComponent } from '../../../features/workshops/components/workshop-card/workshop-card.component';
import { ToastService } from '../../services/toast.service';
import { DxLoadIndicatorModule } from 'devextreme-angular';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [EventCardComponent, AsyncPipe, WorkshopCardComponent, DxLoadIndicatorModule],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
})
export class CardsListComponent {
  @Input({ required: true }) flag!: 'events' | 'workshops' | 'favorites';
  private router = inject(Router);
  private eventsStateService = inject(EventStateService);
  private workshopsStateService = inject(WorkshopStateService);
  private toastService = inject(ToastService);
  eventsList$!: Observable<LoadingState<EventShort[]>>;
  workshopsList$!: Observable<LoadingState<WorkshopShort[]>>;
  cos: boolean = false;

  ngOnInit() {
    if (this.flag === 'events') {
      this.eventsStateService.loadEvents();
      this.eventsList$ = this.eventsStateService.eventsList$;
    } else if (this.flag === 'favorites') {
      this.eventsStateService.loadFavEvents();
      this.eventsList$ = this.eventsStateService.eventsList$;
    } else if (this.flag === 'workshops') {
      this.workshopsStateService.loadWorkshops();
      this.workshopsList$ = this.workshopsStateService.workshopsList$;
    }
  }

  eventClick(id: number) {
    this.router.navigate(['/event', id]);
  }

  workshopClick(id: number) {
    this.router.navigate(['/workshop', id]);
  }

  eventFollowClick(event: EventShort) {
    this.eventsStateService
      .handleEventFollow(event.id, this.flag)
      .subscribe((result) => {
        if (result) {
          if (event.isFavorite) event.followersCount--;
          else event.followersCount++;
          event.isFavorite = !event.isFavorite;
        }
      });
  }
}
