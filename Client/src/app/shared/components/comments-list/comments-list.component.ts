import { Component, inject, Input, input } from '@angular/core';
import { Comment } from '../../models/Comment';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { EventApiService } from '../../../features/events/services/event-api.service';
import { DateCustomPipe } from '../../pipes/custom-date.pipe';
import { EventStateService } from '../../../features/events/services/event-state.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [CommentCardComponent],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.scss',
})
export class CommentsListComponent {
  @Input() comments: Comment[] | null = [];
  @Input({ required: true }) eventId!: number;
  private dataService = inject(EventStateService);

  isInputEmpty: boolean = false;

  sendComment(comment: string) {
    this.dataService.addComment(this.eventId, comment);

    this.isInputEmpty = false;
    /*this.eventService
      .postComment(this.eventDescId, text)
      .pipe(
        tap((data) => {
          data.timestamp = this.datePipe.transform(data.timestamp);
          return data;
        })
      )
      .subscribe({
        next: (response) => {
          this.commentsList.push(response);
          console.log(response);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
        },
      });*/
  }

  onInput(text: string) {
    this.isInputEmpty = text.trim().length > 0;
    console.log(this.isInputEmpty);
  }
}
