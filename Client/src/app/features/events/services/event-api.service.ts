import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { map, Observable, tap } from 'rxjs';
import { EventShort } from '../../../shared/models/EventShort';

@Injectable({
  providedIn: 'root',
})
export class EventApiService {
  private httpClient = inject(HttpClient);
  private URL = 'http://localhost:5253/api/event';

  getAllEvents(): Observable<EventShort[]> {
    return this.httpClient.get<EventShort[]>(`${this.URL}`);
  }
}
