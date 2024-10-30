import { Component, inject, Input, input } from '@angular/core';
import { Comment } from '../../models/Comment';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { EventApiService } from '../../../features/events/services/event-api.service';
import { DateCustomPipe } from '../../pipes/custom-date.pipe';
import { EventStateService } from '../../../features/events/services/event-state.service';
import { Observable } from 'rxjs';
import { escapeLeadingUnderscores } from 'typescript';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { WorkshopStateService } from '../../../features/workshops/services/workshop-state.service';
import { LoadingState } from '../../models/LoadingState';
import { DxLoadIndicatorModule } from 'devextreme-angular';
@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [CommentCardComponent, AsyncPipe, DxLoadIndicatorModule],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.scss',
})
export class CommentsListComponent {
  @Input({ required: true }) contextFlag!: 'event' | 'workshop';
  @Input({ required: true }) contextId!: number;
  private eventService = inject(EventStateService);
  private workshopService = inject(WorkshopStateService);
  private route = inject(ActivatedRoute);
  comments$!: Observable<LoadingState<Comment[]>>;

  isInputEmpty: boolean = false;

  ngOnInit() {
    console.log(this.contextId);
    if (this.contextFlag === 'event') {
      this.comments$ = this.eventService.commentsList$;
      this.eventService.loadComments(this.contextId);
    } else {
      this.comments$ = this.workshopService.commentsList$;
      this.workshopService.loadComments(this.contextId);
    }
  }

  sendComment(comment: string) {
    this.isInputEmpty = false;

    if (this.contextFlag === 'event') {
      this.eventService
        .addComment(this.contextId, comment)
        .subscribe((response) => {
          if (response) console.log('Dodano komentarz.');
          else console.error('Nie udało się dodać komentarza.');
        });
    } else {
      this.workshopService
        .addComment(this.contextId, comment)
        .subscribe((response) => {
          if (response) console.log('Dodano komentarz.');
          else console.error('Nie udało się dodać komentarza.');
        });
    }
  }

  onInput(text: string) {
    this.isInputEmpty = text.trim().length > 0;
    console.log(this.isInputEmpty);
  }
}
