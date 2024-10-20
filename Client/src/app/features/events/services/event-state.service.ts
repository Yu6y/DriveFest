import { inject, Injectable } from '@angular/core';
import { EventApiService } from './event-api.service';
import { EventShort } from '../../../shared/models/EventShort';
import { BehaviorSubject, map, startWith } from 'rxjs';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { setTokenSourceMapRange } from 'typescript';

@Injectable({
  providedIn: 'root',
})
export class EventStateService {
  private apiService = inject(EventApiService);
  private eventsListSubject$ = new BehaviorSubject<EventShort[]>([]);
  private datePipe = inject(DateCustomPipe);
  //sygnal dla error, string lub null, nullowac gdy bedzie odpowiedz, wyskakujace powaidomienia //devexpress toast

  eventsList$ = this.eventsListSubject$.asObservable().pipe(startWith([]));
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
}
