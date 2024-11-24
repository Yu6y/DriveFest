import { inject, Injectable } from '@angular/core';
import { AdminApiService } from './admin-api.service';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';
import { LoadingState } from '../../../shared/models/LoadingState';
import { AdminEvent } from '../../../shared/models/AdminEvent';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { EventDesc } from '../../../shared/models/EventDesc';
import { EventApiService } from '../../events/services/event-api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminStateService {
  private apiService = inject(AdminApiService);
  private datePipe = inject(DateCustomPipe);
  private eventService = inject(EventApiService);

  eventsListSubject$ = new BehaviorSubject<LoadingState<AdminEvent[]>>({
    state: 'idle',
  });
  eventToEdtiSubject$ = new BehaviorSubject<LoadingState<EventDesc>>({
    state: 'idle',
  });

  eventsList$ = this.eventsListSubject$.asObservable();
  eventEdit$ = this.eventToEdtiSubject$.asObservable();

  loadEventsList() {
    this.eventsListSubject$.next({ state: 'loading' });

    this.apiService
      .getUnverifiedEvents()
      .pipe(
        map((data) => {
          data.forEach((x) => {
            x.date = this.datePipe.transform(x.date);
          });

          return data;
        }),
        tap((res) => {
          this.eventsListSubject$.next({ state: 'success', data: res });
        }),
        catchError((err) => {
          this.eventsListSubject$.next({ state: 'error', error: err });
          return throwError(err);
        })
      )
      .subscribe();
  }

  acceptEvent(id: number) {
    const currentListState = this.eventsListSubject$.value;

    if (currentListState.state !== 'success' || !currentListState.data) {
      return;
    }

    this.apiService.verifyEvent(id).subscribe(
      (res) => {
        this.eventsListSubject$.next({
          state: 'success',
          data: currentListState.data.filter((r) => r.id != id),
        });
      },
      (error) => {
        this.eventsListSubject$.next({ state: 'error', error: error });
        console.log(error);
      }
    );
  }

  deleteEvent(id: number) {
    const currentListState = this.eventsListSubject$.value;

    if (currentListState.state !== 'success' || !currentListState.data) {
      return;
    }

    this.apiService.deleteEvent(id).subscribe(
      (res) => {
        this.eventsListSubject$.next({
          state: 'success',
          data: currentListState.data.filter((r) => r.id != id),
        });
      },
      (error) => {
        this.eventsListSubject$.next({ state: 'error', error: error });
        console.log(error);
      }
    );
  }

  getEventToEdit(id: number) {
    this.eventToEdtiSubject$.next({ state: 'loading' });

    this.eventService.getEventDesc(id).pipe;
  }
}
