import { Component, inject } from '@angular/core';
import { EventStateService } from '../../services/event-state.service';
import { AsyncPipe } from '@angular/common';
import { CardsListComponent } from '../../../../shared/components/cards-list/cards-list.component';

@Component({
  selector: 'app-fav-list',
  standalone: true,
  imports: [AsyncPipe, CardsListComponent],
  templateUrl: './fav-list.component.html',
  styleUrl: './fav-list.component.scss',
})
export class FavListComponent {
  private eventService = inject(EventStateService);

  ngOnInit() {
    this.eventService.startEventList();
  }
}
