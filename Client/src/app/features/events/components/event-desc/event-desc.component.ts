import { Component, inject } from '@angular/core';
import { EventDesc } from '../../../../shared/models/EventDesc';
import { MatIconModule } from '@angular/material/icon';
import { CommentsListComponent } from '../../../../shared/components/comments-list/comments-list.component';
import { ActivatedRoute } from '@angular/router';
import { EventStateService } from '../../services/event-state.service';
import { Tag } from '../../../../shared/models/Tag';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { DxLoadIndicatorModule } from 'devextreme-angular';

@Component({
  selector: 'app-event-desc',
  standalone: true,
  imports: [
    MatIconModule,
    CommentsListComponent,
    AsyncPipe,
    DxLoadIndicatorModule,
  ],
  templateUrl: './event-desc.component.html',
  styleUrl: './event-desc.component.scss',
})
export class EventDescComponent {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventStateService);
  event$!: Observable<LoadingState<EventDesc>>;
  tags!: string;

  ngOnInit() {
    this.eventService.getEventDesc(+this.route.snapshot.params['id']);
    this.event$ = this.eventService.eventDesc$;
  }

  makeTags(tags: Tag[]) {
    let tagsDesc: string[] = tags.map((tag) => tag.name);
    return tagsDesc.join(', ');
  }

  followClick(event: EventDesc) {
    this.eventService.handleEventDescFollow(event.id).subscribe();
  }
}
