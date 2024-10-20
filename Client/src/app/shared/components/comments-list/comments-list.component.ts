import { Component, inject, Input, input } from '@angular/core';
import { Comment } from '../../models/Comment';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { EventApiService } from '../../../features/events/services/event-api.service';
import { DateCustomPipe } from '../../pipes/custom-date.pipe';
@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [CommentCardComponent],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.scss',
})
export class CommentsListComponent {
  @Input({ required: true }) eventId!: number;

  private eventService = inject(EventApiService);
  private datePipe = inject(DateCustomPipe);

  commentsList!: Comment[];
  isInputEmpty: boolean = false;

  ngOnInit() {
    /* this.eventService.getComments(this.eventId).subscribe(
      (response) => {
        console.log(response);
        this.commentsList = response;
      },
      (error) => {
        console.log(error);
      }
    );*/
  }

  //zmienic!!
  sendComment(text: string) {
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
      });
    this.isInputEmpty = false;*/
  }

  onInput(text: string) {
    this.isInputEmpty = text.trim().length > 0;
    console.log(this.isInputEmpty);
  }
}
