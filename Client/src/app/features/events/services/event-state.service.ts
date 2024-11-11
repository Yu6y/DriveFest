import { inject, Injectable } from '@angular/core';
import { EventApiService } from './event-api.service';
import { EventShort } from '../../../shared/models/EventShort';
import {
  BehaviorSubject,
  catchError,
  delay,
  map,
  Observable,
  of,
  startWith,
  tap,
  throwError,
} from 'rxjs';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { setTokenSourceMapRange } from 'typescript';
import { EventDesc } from '../../../shared/models/EventDesc';
import { Comment } from '../../../shared/models/Comment';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingState } from '../../../shared/models/LoadingState';
import { Tag } from '../../../shared/models/Tag';
import { EventListFiltersFormValue } from '../components/event-filters/event-filters.component';
import { state } from '@angular/animations';
import { Router } from '@angular/router';
import { elementSelectors } from '@angular/cdk/schematics';
import { EventAddFormValue } from '../../add-forms/add-event/add-event.component';
import { ToastService } from '../../../shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class EventStateService {
  private apiService = inject(EventApiService);
  private datePipe = inject(DateCustomPipe);
  private router = inject(Router);
  private toastState = inject(ToastService);

  private eventsListSubject$ = new BehaviorSubject<LoadingState<EventShort[]>>({
    state: 'idle',
  });
  private commentsListSubject$ = new BehaviorSubject<LoadingState<Comment[]>>({
    state: 'idle',
  });
  private eventDescSubject$ = new BehaviorSubject<LoadingState<EventDesc>>({
    state: 'idle',
  });

  eventsList$ = this.eventsListSubject$.asObservable();
  commentsList$ = this.commentsListSubject$.asObservable();
  eventDesc$ = this.eventDescSubject$.asObservable();

  startEventList() {
    this.eventsListSubject$.next({ state: 'idle' });
  }

  startCommentList() {
    this.commentsListSubject$.next({ state: 'idle' });
  }

  loadEvents() {
    this.eventsListSubject$.next({ state: 'loading' });
    this.apiService
      .getAllEvents()
      .pipe(
        map((data) => {
          data.forEach((x) => {
            x.date = this.datePipe.transform(x.date);
          });

          return data;
        }),
        tap((response) => {
          of(response)
            .pipe(delay(200))
            .subscribe((res) => {
              this.eventsListSubject$.next({ state: 'success', data: res });
              console.log(res);
            });
        }),
        catchError((error: HttpErrorResponse) => {
          this.eventsListSubject$.next({
            state: 'error',
            error: error.message,
          });
          return throwError(error);
        })
      )
      .subscribe();
  }

  getEventDesc(eventId: number) {
    this.eventDescSubject$.next({ state: 'loading' });
    this.apiService
      .getEventDesc(eventId)
      .pipe(
        map((data) => {
          data.date = this.datePipe.transform(data.date);

          return data;
        }),
        tap((response) => {
          this.eventDescSubject$.next({ state: 'success', data: response });
          console.log(response);
        }),
        catchError((error: HttpErrorResponse) => {
          this.eventDescSubject$.next({
            state: 'error',
            error: error.message,
          });
          this.router.navigate(['/error']);
          return throwError(error);
        })
      )
      .subscribe();
  }

  loadComments(eventId: number) {
    this.commentsListSubject$.next({ state: 'loading' });
    this.apiService
      .getComments(eventId)
      .pipe(
        tap((response) => {
          of(response)
            .pipe(delay(200))
            .subscribe((res) => {
              res.forEach(
                (x) => (x.timestamp = this.datePipe.transform(x.timestamp))
              );
              this.commentsListSubject$.next({ state: 'success', data: res });
              console.log(res);
            });
        }),
        catchError((error: HttpErrorResponse) => {
          this.commentsListSubject$.next({
            state: 'error',
            error: 'Wystąpił błąd podczas ładowania komentarzy.',
          });
          return throwError(error);
        })
      )
      .subscribe();
  }

  addComment(eventId: number, comment: string): Observable<boolean> {
    comment = comment.trim();
    const currentCommentsState = this.commentsListSubject$.value;

    if (
      currentCommentsState.state !== 'success' ||
      !currentCommentsState.data
    ) {
      return of(false);
    }

    return this.apiService.postComment(eventId, comment).pipe(
      tap((response) => {
        response.timestamp = this.datePipe.transform(response.timestamp);
        this.toastState.showToast('Dodano komentarz.', 'success');
        this.commentsListSubject$.next({
          state: 'success',
          data: [response, ...currentCommentsState.data],
        });
      }),
      catchError((error) => {
        this.toastState.showToast('Nie udało się dodać komentarza.', 'error');
        console.error('Nie udało się dodać komentarza.', error);
        return of(false);
      }),
      map((s) => (s ? true : false))
    );
  }

  handleEventFollow(eventId: number, flag: string): Observable<boolean> {
    const currentEventsState = this.eventsListSubject$.value;
    console.log(currentEventsState.state);
    if (currentEventsState.state !== 'success' || !currentEventsState.data) {
      return of(false);
    }

    const eventIndex = currentEventsState.data.findIndex(
      (event: EventShort) => event.id === eventId
    );
    if (eventIndex === -1) return of(false);

    const event = currentEventsState.data[eventIndex];
    const isCurrentlyFollowed = event.isFavorite;

    const action$ = isCurrentlyFollowed
      ? this.apiService.unFollowEvent(eventId)
      : this.apiService.followEvent(eventId);

    return action$.pipe(
      tap(() => {
        const updatedEvent: EventShort = {
          ...event,
          isFavorite: !isCurrentlyFollowed,
          followersCount: isCurrentlyFollowed
            ? event.followersCount - 1
            : event.followersCount + 1,
        };
        if (updatedEvent.isFavorite)
          this.toastState.showToast('Zaobserwowano wydarzenie', 'success');
        else this.toastState.showToast('Odobserwowano wydarzenie', 'info');

        let updatedEvents: EventShort[];

        if (flag === 'favorites')
          updatedEvents = currentEventsState.data.filter(
            (x) => x.id !== updatedEvent.id
          );
        else {
          updatedEvents = [...currentEventsState.data];
          updatedEvents[eventIndex] = updatedEvent;
        }

        this.eventsListSubject$.next({
          state: 'success',
          data: updatedEvents,
        });
      }),
      catchError((error) => {
        this.toastState.showToast(
          'Wystąpił błąd. Spróbuj ponownie później',
          'error'
        );
        console.error('Error following/unfollowing event:', error);
        return of(false);
      }),
      map(() => true)
    );
  }

  handleEventDescFollow(eventId: number): Observable<boolean> {
    const currentEventState = this.eventDescSubject$.value;
    if (currentEventState.state !== 'success' || !currentEventState.data) {
      return of(false);
    }

    const isCurrentlyFollowed = currentEventState.data.isFavorite;

    const action$ = isCurrentlyFollowed
      ? this.apiService.unFollowEvent(eventId)
      : this.apiService.followEvent(eventId);

    return action$.pipe(
      tap(() => {
        if (isCurrentlyFollowed)
          this.toastState.showToast('Odobserwowano wydarzenie', 'info');
        else this.toastState.showToast('Zaobserwowano wydarzenie', 'success');

        if (isCurrentlyFollowed) currentEventState.data.followersCount--;
        else currentEventState.data.followersCount++;
        currentEventState.data.isFavorite = !currentEventState.data.isFavorite;

        this.eventDescSubject$.next({
          state: 'success',
          data: currentEventState.data,
        });
      }),
      catchError((error) => {
        this.toastState.showToast(
          'Wystąpił błąd. Spróbuj ponownie później',
          'error'
        );
        console.error('Error following/unfollowing event:', error);
        return of(false);
      }),
      map(() => true)
    );
  }

  loadFavEvents() {
    this.eventsListSubject$.next({ state: 'loading' });
    this.apiService
      .getFavoriteEvents()
      .pipe(
        map((data) => {
          data.forEach((x) => {
            x.date = this.datePipe.transform(x.date);
          });

          return data;
        }),
        tap((response) => {
          of(response)
            .pipe(delay(200))
            .subscribe((res) => {
              this.eventsListSubject$.next({ state: 'success', data: res });
              console.log(res);
            });
        }),
        catchError((error: HttpErrorResponse) => {
          this.eventsListSubject$.next({
            state: 'error',
            error: error.message,
          });
          return throwError(error);
        })
      )
      .subscribe();
  }

  getTags() {
    return this.apiService.getTags();
  }

  loadFilteredEvents(searchParams: EventListFiltersFormValue) {
    this.eventsListSubject$.next({ state: 'loading' });

    searchParams.searchTerm = searchParams.searchTerm.trim();
    console.log(searchParams.searchTerm);
    if (searchParams.searchTerm.length === 0) searchParams.searchTerm = '%';
    if (searchParams.dateFrom.length === 0)
      searchParams.dateFrom = '1990-01-01';
    if (searchParams.dateTo.length === 0) searchParams.dateTo = '2100-01-01';

    return this.apiService
      .getEventsFiltered(searchParams)
      .pipe(
        map((data) => {
          data.forEach((x) => {
            x.date = this.datePipe.transform(x.date);
          });

          return data;
        }),
        tap((response) => {
          of(response)
            .pipe(delay(200))
            .subscribe((res) => {
              this.eventsListSubject$.next({ state: 'success', data: res });
              console.log(res);
            });
        }),
        catchError((error: HttpErrorResponse) => {
          this.eventsListSubject$.next({
            state: 'error',
            error: error.message,
          });
          return throwError(error);
        })
      )
      .subscribe();
  }

  addEvent(event: EventAddFormValue) {
    console.log(event);
    const form = new FormData();

    form.append('name', event.name);
    form.append('date', event.date);
    form.append('city', event.city);
    form.append('address', event.address);
    if (event.photoURL) form.append('PhotoURL', event.photoURL);
    form.append('voivodeship', event.voivodeship);
    form.append('desc', event.desc);
    form.append('eventTags', event.tags.map((tag) => tag.id).join(','));

    console.log(form);
    return this.apiService.addEvent(form);
  }
}
