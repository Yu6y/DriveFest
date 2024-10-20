import { inject, Injectable } from '@angular/core';
import { EventApiService } from './event-api.service';
import { EventShort } from '../../../shared/models/EventShort';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  tap,
} from 'rxjs';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { setTokenSourceMapRange } from 'typescript';
import { EventDesc } from '../../../shared/models/EventDesc';
import { Comment } from '../../../shared/models/Comment';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventStateService {
  private apiService = inject(EventApiService);
  private datePipe = inject(DateCustomPipe);

  private eventsListSubject$ = new BehaviorSubject<EventShort[]>([]);
  private commentsListSubject$ = new BehaviorSubject<Comment[]>([]);
  //sygnal dla error, string lub null, nullowac gdy bedzie odpowiedz, wyskakujace powaidomienia //devexpress toast

  eventsList$ = this.eventsListSubject$.asObservable().pipe(startWith([]));
  commentsList$ = this.commentsListSubject$.asObservable().pipe(startWith([]));
  //komentarze desc itp osobne sygnaly ^

  loadEvents() {
    this.apiService
      .getAllEvents()
      .pipe(
        map((response) => {
          response.forEach((obj) => {
            obj.date = this.datePipe.transform(obj.date);
          });

          return response;
        })
      )
      .subscribe((events) => {
        this.eventsListSubject$.next(events);
      });
  }

  getEventDesc(eventId: number): Observable<EventDesc> {
    return this.apiService.getEventDesc(eventId).pipe(
      map((response) => {
        response.date = this.datePipe.transform(response.date);
        return response;
      })
    );
  }

  loadComments(eventId: number) {
    this.apiService
      .getComments(eventId)
      .pipe(
        map((response) => {
          response.forEach((obj) => {
            obj.timestamp = this.datePipe.transform(obj.timestamp);
          });

          return response;
        })
      )
      .subscribe((comments) => {
        this.commentsListSubject$.next(comments);
      });
  }

  addComment(eventId: number, comment: string) {
    comment = comment.trim();

    this.apiService
      .postComment(eventId, comment)
      .pipe(
        map((response) => {
          response.timestamp = this.datePipe.transform(response.timestamp);
          return response;
        })
      )
      .subscribe({
        next: (response) => {
          this.commentsListSubject$.next([
            response,
            ...this.commentsListSubject$.value,
          ]);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
        },
      });
  }

  handleEventFollow(eventId: number): Observable<boolean> {
    const isFollowed: boolean = this.eventsListSubject$.value.find(
      (x) => x.id === eventId
    )!.isFavorite;
    const index: number = this.eventsListSubject$.value.findIndex(
      (x) => x.id === eventId
    );

    if (index === -1) return of(false);

    if (isFollowed) {
      return this.apiService.unFollowEvent(eventId).pipe(
        catchError((error) => {
          console.log(error);
          return of(false);
        }),
        tap(() => {
          this.eventsListSubject$.value.at(index)!.followersCount--;
          this.eventsListSubject$.value.at(index)!.isFavorite = false;
        }),
        map(() => true)
      );
    } else {
      return this.apiService.followEvent(eventId).pipe(
        catchError((error) => {
          console.log(error);
          return of(false);
        }),
        tap(() => {
          this.eventsListSubject$.value.at(index)!.followersCount++;
          this.eventsListSubject$.value.at(index)!.isFavorite = true;
        }),
        map(() => true)
      );
    }
  }
}
