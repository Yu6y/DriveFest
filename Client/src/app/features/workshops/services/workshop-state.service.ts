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
import { Comment } from '../../../shared/models/Comment';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { WorkshopDesc } from '../../../shared/models/WorkshopDesc';
import { Router } from '@angular/router';
import { WorkshopAddFormValue } from '../../add-forms/add-workshop/add-workshop.component';
import { ToastService } from '../../../shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class WorkshopStateService {
  private apiService = inject(WorkshopApiService);
  private datePipe = inject(DateCustomPipe);
  private router = inject(Router);
  private toastState = inject(ToastService);
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
            .pipe(delay(200))
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
            .pipe(delay(200))
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

  getWorkshopsTags() {
    return this.apiService.getWorkshopsTags();
  }

  loadComments(workshopId: number) {
    this.commentsListSubject$.next({ state: 'loading' });
    this.apiService
      .getComments(workshopId)
      .pipe(
        tap((response) => {
          of(response)
            .pipe(delay(200))
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
        this.toastState.showToast('Dodano komentarz.', 'success');
        this.commentsListSubject$.next({
          state: 'success',
          data: [response, ...currentCommentsState.data],
        });
        console.log('testy');
      }),
      catchError((error) => {
        this.toastState.showToast('Nie udało się dodać komentarza.', 'error');
        console.error('Nie udało się dodać komentarza.', error);
        return of(false);
      }),
      map((s) => (s ? true : false))
    );
  }

  addWorkshop(workshop: WorkshopAddFormValue) {
    const form = new FormData();

    form.append('name', workshop.name);
    form.append('city', workshop.city);
    form.append('address', workshop.address);
    if (workshop.photoURL) form.append('photoURL', workshop.photoURL);
    form.append('voivodeship', workshop.voivodeship);
    form.append('workshopTags', workshop.tags.map((tag) => tag.id).join(','));
    form.append('desc', workshop.desc);

    console.log(workshop.tags);

    return this.apiService.addWorkshop(form);
  }

  rateWorkshop(rate: number, isRated: boolean) {
    let workshop: WorkshopDesc;
    if (this.workshopDescSubject$.value.state === 'success') {
      workshop = this.workshopDescSubject$.value.data;
      this.apiService
        .rateWorkshop(rate, this.workshopDescSubject$.value.data.id)
        .pipe(
          tap((res) => {
            workshop.rate = res;
            if (!isRated) workshop.ratesCount++;
            this.workshopDescSubject$.next({
              state: 'success',
              data: workshop,
            });
          })
        )
        .subscribe(
          () => this.toastState.showToast('Dodano ocenę.', 'success'),
          (error) => {
            this.toastState.showToast(
              'Nie udało się ocenić warsztatu.',
              'error'
            );
          }
        );
    }
  }

  getWorkshopRate(workshopId: number) {
    return this.apiService.getWorkshopRate(workshopId);
  }
}
