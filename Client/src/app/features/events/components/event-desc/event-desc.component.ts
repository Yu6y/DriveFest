import { Component, inject, Inject, Injector, Input } from '@angular/core';
import { EventDesc } from '../../../../shared/models/EventDesc';
import { MatIconModule } from '@angular/material/icon';
import { CommentsListComponent } from '../../../../shared/components/comments-list/comments-list.component';
import { ActivatedRoute } from '@angular/router';
import { EventStateService } from '../../services/event-state.service';
import { Tag } from '../../../../shared/models/Tag';
import { Observable, ObservedValueOf, tap } from 'rxjs';
import { Comment } from '../../../../shared/models/Comment';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-event-desc',
  standalone: true,
  imports: [MatIconModule, CommentsListComponent, AsyncPipe],
  templateUrl: './event-desc.component.html',
  styleUrl: './event-desc.component.scss',
})
export class EventDescComponent {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventStateService);
  event: EventDesc = {} as EventDesc;
  tags!: string;
  comments$!: Observable<Comment[]>;

  ngOnInit() {
    this.eventService
      .getEventDesc(+this.route.snapshot.params['id'])
      .subscribe((response) => {
        console.log(response);
        this.event = response;
        this.tags = '#' + this.makeTags(response.tags);
      });

    this.eventService.loadComments(+this.route.snapshot.params['id']);
    this.comments$ = this.eventService.commentsList$;
  }

  makeTags(tags: Tag[]) {
    let tagsDesc: string[] = tags.map((tag) => tag.name);
    return tagsDesc.join(', ');
  }

  followClick() {
    this.eventService.handleEventFollow(this.event.id).subscribe((result) => {
      if (result) {
        if (this.event.isFavorite) this.event.followersCount--;
        else this.event.followersCount++;
        this.event.isFavorite = !this.event.isFavorite;
      } else {
        console.log('Operation failed.');
      }
    });
  }
}
