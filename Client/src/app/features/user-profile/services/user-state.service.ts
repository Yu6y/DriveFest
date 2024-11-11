import { inject, Injectable } from '@angular/core';
import { UserApiService } from './user-api.service';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { UserProfile } from '../../../shared/models/UserProfile';
import { LoadingState } from '../../../shared/models/LoadingState';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private userApi = inject(UserApiService);
  private datePipe = inject(DateCustomPipe);
  private userSubject$ = new BehaviorSubject<LoadingState<UserProfile>>({
    state: 'idle',
  });

  user$ = this.userSubject$.asObservable();

  getUser() {
    this.userSubject$.next({ state: 'loading' });

    this.userApi
      .getUser()
      .pipe(
        tap((res) => {
          if (res.followedEvent)
            res.followedEvent.date = this.datePipe.transform(
              res.followedEvent.date
            );
          this.userSubject$.next({ state: 'success', data: res });
        }),
        catchError((error) => {
          this.userSubject$.next({ state: 'error', error: error });
          return throwError(error);
        })
      )
      .subscribe();
  }
}
