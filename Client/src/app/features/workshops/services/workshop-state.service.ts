import { inject, Injectable } from '@angular/core';
import { WorkshopApiService } from './workshop-api.service';
import {
  BehaviorSubject,
  catchError,
  delay,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { LoadingState } from '../../../shared/models/LoadingState';
import { WorkshopShort } from '../../../shared/models/WorkshopShort';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkshopListFiltersFormValue } from '../components/workshop-filters/workshop-filters.component';
import { DatePipe } from '@angular/common';
import { Comment } from '../../../shared/models/Comment';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { WorkshopDesc } from '../../../shared/models/WorkshopDesc';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WorkshopStateService {
  private apiService = inject(WorkshopApiService);
  private datePipe = inject(DateCustomPipe);
  private router = inject(Router);
  private workshopsListSubject$ = new BehaviorSubject<
    LoadingState<WorkshopShort[]>
  >({
    state: 'idle',
  });
  private commentsListSubject$ = new BehaviorSubject<LoadingState<Comment[]>>({
    state: 'idle',
  });
  private workshopDescSubject$ = new BehaviorSubject<
    LoadingState<WorkshopDesc>
  >({
    state: 'idle',
  });

  workshopsList$ = this.workshopsListSubject$.asObservable();
  commentsList$ = this.commentsListSubject$.asObservable();
  workshopDesc$ = this.workshopDescSubject$.asObservable();

  loadWorkshops() {
    this.workshopsListSubject$.next({ state: 'loading' });

    this.apiService
      .getAllWorkshops()
      .pipe(
        tap((response) => {
          of(response)
            .pipe(delay(1000))
            .subscribe((res) => {
              console.log(res);
              this.workshopsListSubject$.next({ state: 'success', data: res });
            });
        }),
        catchError((error: HttpErrorResponse) => {
          this.workshopsListSubject$.next({
            state: 'error',
            error: error.message,
          });
          return throwError(error);
        })
      )
      .subscribe();
  }

  getTags() {
    return this.apiService.getWorkshopsTags();
  }

  loadFilteredWorkshops(searchParams: WorkshopListFiltersFormValue) {
    this.workshopsListSubject$.next({ state: 'loading' });

    searchParams.searchTerm = searchParams.searchTerm.trim();

    if (searchParams.searchTerm.length === 0) searchParams.searchTerm = '%';

    this.apiService
      .getFilteredWorkshops(searchParams)
      .pipe(
        tap((response) => {
          of(response)
            .pipe(delay(1000))
            .subscribe((res) => {
              console.log(res);
              this.workshopsListSubject$.next({ state: 'success', data: res });
            });
        }),
        catchError((error: HttpErrorResponse) => {
          this.workshopsListSubject$.next({
            state: 'error',
            error: error.message,
          });
          return throwError(error);
        })
      )
      .subscribe();
  }

  getWorkshopDesc(workshopId: number) {
    this.workshopDescSubject$.next({ state: 'loading' });
    this.apiService
      .getWorkshopDesc(workshopId)
      .pipe(
        tap((response) => {
          this.workshopDescSubject$.next({ state: 'success', data: response });
          console.log(response);
        }),
        catchError((error: HttpErrorResponse) => {
          this.workshopDescSubject$.next({
            state: 'error',
            error: error.message,
          });
          this.router.navigate(['/error']);
          return throwError(error);
        })
      )
      .subscribe();
  }

  loadComments(workshopId: number) {
    this.commentsListSubject$.next({ state: 'loading' });
    this.apiService
      .getComments(workshopId)
      .pipe(
        tap((response) => {
          of(response)
            .pipe(delay(1000))
            .subscribe((res) => {
              res.forEach(
                (comment) =>
                  (comment.timestamp = this.datePipe.transform(
                    comment.timestamp
                  ))
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

  addComment(workshopId: number, comment: string): Observable<boolean> {
    comment = comment.trim();
    const currentCommentsState = this.commentsListSubject$.value;

    if (
      currentCommentsState.state !== 'success' ||
      !currentCommentsState.data
    ) {
      return of(false);
    }

    return this.apiService.postComment(workshopId, comment).pipe(
      tap((response) => {
        response.timestamp = this.datePipe.transform(response.timestamp);
        this.commentsListSubject$.next({
          state: 'success',
          data: [response, ...currentCommentsState.data],
        });
      }),
      catchError((error) => {
        console.error('Nie udało się dodać komentarza.', error);
        return of(false);
      }),
      map((s) => (s ? true : false))
    );
  }
}
