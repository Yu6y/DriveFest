import { inject, Injectable } from '@angular/core';
import { AdminApiService } from './admin-api.service';
import {
  BehaviorSubject,
  catchError,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { LoadingState } from '../../../shared/models/LoadingState';
import { AdminEvent } from '../../../shared/models/AdminEvent';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { EventApiService } from '../../events/services/event-api.service';
import { Router } from '@angular/router';
import { EventEdit } from '../../../shared/models/EventEdit';
import { Tag } from '../../../shared/models/Tag';
import { CustomTag } from '../components/edit-event/edit-event.component';
import { ToastService } from '../../../shared/services/toast.service';
import { AdminWorkshop } from '../../../shared/models/AdminWorkshop';
import { WorkshopEdit } from '../../../shared/models/WorkshopEdit';
import { WorkshopApiService } from '../../workshops/services/workshop-api.service';
import { UserData } from '../../../shared/models/UserData';
import { ListData } from '../../../shared/models/AdminListData';

@Injectable({
  providedIn: 'root',
})
export class AdminStateService {
  private apiService = inject(AdminApiService);
  private datePipe = inject(DateCustomPipe);
  private eventApiService = inject(EventApiService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private workshopApiService = inject(WorkshopApiService);

  eventsListSubject$ = new BehaviorSubject<
    LoadingState<ListData<AdminEvent[]>>
  >({
    state: 'idle',
  });
  workshopsListSubject$ = new BehaviorSubject<
    LoadingState<ListData<AdminWorkshop[]>>
  >({
    state: 'idle',
  });
  eventToEditSubject$ = new BehaviorSubject<LoadingState<EventEdit>>({
    state: 'idle',
  });
  tagsSubject$ = new BehaviorSubject<LoadingState<CustomTag[]>>({
    state: 'idle',
  });
  workshopToEditSubject$ = new BehaviorSubject<LoadingState<WorkshopEdit>>({
    state: 'idle',
  });
  usersDataSubject$ = new BehaviorSubject<LoadingState<ListData<UserData[]>>>({
    state: 'idle',
  });

  eventsList$ = this.eventsListSubject$.asObservable();
  workshopsList$ = this.workshopsListSubject$.asObservable();
  eventEdit$ = this.eventToEditSubject$.asObservable();
  tags$ = this.tagsSubject$.asObservable();
  workshopEdit$ = this.workshopToEditSubject$.asObservable();
  usersData$ = this.usersDataSubject$.asObservable();

  loadEventsList(pageIndex: number, pageSize: number) {
    this.eventsListSubject$.next({ state: 'loading' });
    this.apiService
      .getUnverifiedEvents(pageIndex, pageSize)
      .pipe(
        map((data) => {
          data.list.forEach((x) => {
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
      (_) => {
        this.eventsListSubject$.next({
          state: 'success',
          data: {
            total: currentListState.data.total,
            list: currentListState.data.list.filter((r) => r.id != id),
          },
        });
      },
      (error) => {
        this.eventsListSubject$.next({ state: 'error', error: error });
        console.log(error);
      }
    );
  }

  deleteEvent(id: number) {
    console.log(`delete ${id}`);
    const currentListState = this.eventsListSubject$.value;

    if (currentListState.state !== 'success' || !currentListState.data) {
      return;
    }

    this.apiService.deleteEvent(id).subscribe(
      (_) => {
        this.eventsListSubject$.next({
          state: 'success',
          data: {
            total: currentListState.data.total,
            list: currentListState.data.list.filter((r) => r.id != id),
          },
        });
      },
      (error) => {
        this.eventsListSubject$.next({ state: 'error', error: error });
        console.log(error);
      }
    );
  }

  getEventToEdit(id: number) {
    this.tagsSubject$.next({ state: 'loading' });
    this.eventToEditSubject$.next({ state: 'loading' });

    this.apiService
      .getEventToEdit(id)
      .pipe(
        switchMap((e) =>
          this.eventApiService.getTags().pipe(
            map((tags) => ({
              e,
              tags: this.modifyTags(tags, e),
            }))
          )
        ),
        tap(({ e, tags }) => {
          this.eventToEditSubject$.next({ state: 'success', data: e });
          this.tagsSubject$.next({ state: 'success', data: tags });
        }),
        catchError((error) => {
          console.log(error);
          this.eventToEditSubject$.next({ state: 'error', error: error });
          this.tagsSubject$.next({ state: 'error', error: error });
          return throwError(error);
        })
      )
      .subscribe();
  }

  modifyTags(tags: Tag[], event: EventEdit) {
    return tags.map((tag) => ({
      ...tag,
      selected: event.tags.some((eventTag) => eventTag.id === tag.id),
    }));
  }

  editEvent(data: EventEdit) {
    const form = new FormData();

    form.append('id', data.id.toString());
    form.append('name', data.name);
    form.append('date', data.date);
    form.append('location', data.location);
    form.append('address', data.address);
    if (data.photoURL) form.append('photoURL', data.photoURL);
    form.append('voivodeship', data.voivodeship);
    form.append('description', data.description);
    form.append('tags', data.tags.map((tag) => tag.id).join(','));

    this.apiService
      .updateEvent(form)
      .pipe(
        tap((_) => this.router.navigate(['admin/events'])),
        catchError((error) => {
          this.toastService.showToast(
            'Nie udało się edytować wydarzenia.',
            'error'
          );

          this.router.navigate(['/admin/events']);
          return throwError(error);
        })
      )
      .subscribe();
  }

  loadWorkshopsList(pageIndex: number, pageSize: number) {
    this.workshopsListSubject$.next({ state: 'loading' });

    this.apiService
      .getUnverifiedWorkshops(pageIndex, pageSize)
      .pipe(
        tap((res) => {
          this.workshopsListSubject$.next({ state: 'success', data: res });
        }),
        catchError((err) => {
          this.workshopsListSubject$.next({ state: 'error', error: err });
          return throwError(err);
        })
      )
      .subscribe();
  }

  acceptWorkshop(id: number) {
    const currentListState = this.workshopsListSubject$.value;

    if (currentListState.state !== 'success' || !currentListState.data) {
      return;
    }

    this.apiService.verifyWorkshop(id).subscribe(
      (_) => {
        this.workshopsListSubject$.next({
          state: 'success',
          data: {
            total: currentListState.data.total,
            list: currentListState.data.list.filter(
              (r) => r.id != id
            ) as AdminWorkshop[],
          },
        });
      },
      (error) => {
        this.workshopsListSubject$.next({ state: 'error', error: error });
        console.log(error);
      }
    );
  }

  deleteWorkshop(id: number) {
    const currentListState = this.workshopsListSubject$.value;

    if (currentListState.state !== 'success' || !currentListState.data) {
      return;
    }

    this.apiService.deleteWorkshop(id).subscribe(
      (_) => {
        this.workshopsListSubject$.next({
          state: 'success',
          data: {
            total: currentListState.data.total,
            list: currentListState.data.list.filter((r) => r.id != id),
          },
        });
      },
      (error) => {
        this.workshopsListSubject$.next({ state: 'error', error: error });
        console.log(error);
      }
    );
  }

  getWorkshopToEdit(id: number) {
    this.tagsSubject$.next({ state: 'loading' });
    this.workshopToEditSubject$.next({ state: 'loading' });

    this.apiService
      .getWorkshopToEdit(id)
      .pipe(
        switchMap((e) =>
          this.workshopApiService.getWorkshopsTags().pipe(
            map((tags) => ({
              e,
              tags: this.modifyWorkshopTags(tags, e),
            }))
          )
        ),
        tap(({ e, tags }) => {
          this.workshopToEditSubject$.next({ state: 'success', data: e });
          this.tagsSubject$.next({ state: 'success', data: tags });
        }),
        catchError((error) => {
          console.log(error);
          this.workshopToEditSubject$.next({ state: 'error', error: error });
          this.tagsSubject$.next({ state: 'error', error: error });
          return throwError(error);
        })
      )
      .subscribe();
  }

  modifyWorkshopTags(tags: Tag[], workshop: WorkshopEdit) {
    return tags.map((tag) => ({
      ...tag,
      selected: workshop.tags.some((workshopTag) => workshopTag.id === tag.id),
    }));
  }

  editWorkshop(data: WorkshopEdit) {
    const form = new FormData();

    form.append('id', data.id.toString());
    form.append('name', data.name);
    form.append('location', data.location);
    form.append('address', data.address);
    if (data.photoURL) form.append('photoURL', data.photoURL);
    form.append('voivodeship', data.voivodeship);
    form.append('description', data.description);
    form.append('tags', data.tags.map((tag) => tag.id).join(','));

    this.apiService
      .updateWorkshop(form)
      .pipe(
        tap((_) => this.router.navigate(['admin/workshops'])),
        catchError((error) => {
          this.toastService.showToast(
            'Nie udało się edytować wydarzenia.',
            'error'
          );

          this.router.navigate(['/admin/workshops']);
          return throwError(error);
        })
      )
      .subscribe();
  }

  getUsersData(pageIndex: number, pageSize: number) {
    this.usersDataSubject$.next({ state: 'loading' });

    this.apiService
      .getUsersData(pageIndex, pageSize)
      .pipe(
        map((data) => {
          data.list.forEach((x) => {
            x.createdAt = this.datePipe.transform(x.createdAt);
          });

          return data;
        }),
        tap((res) =>
          this.usersDataSubject$.next({ state: 'success', data: res })
        ),
        catchError((err) => {
          console.log(err);
          this.usersDataSubject$.next({ state: 'error', error: err });
          return throwError(err);
        })
      )
      .subscribe();
  }

  promoteUser(id: number) {
    this.apiService
      .promoteUser(id)
      .pipe(
        catchError((err) => {
          console.log(err);
          return throwError(err);
        })
      )
      .subscribe();
  }

  demoteUser(id: number) {
    this.apiService
      .demoteUser(id)
      .pipe(
        catchError((err) => {
          console.log(err);
          return throwError(err);
        })
      )
      .subscribe();
  }
}
