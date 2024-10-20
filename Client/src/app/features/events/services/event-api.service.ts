import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { DateCustomPipe } from '../../../shared/pipes/custom-date.pipe';
import { map, Observable, tap } from 'rxjs';
import { EventShort } from '../../../shared/models/EventShort';
import { EventDesc } from '../../../shared/models/EventDesc';
import { Comment } from '../../../shared/models/Comment';

@Injectable({
  providedIn: 'root',
})
export class EventApiService {
  private httpClient = inject(HttpClient);
  private URL = 'http://localhost:5253/api/event';

  getAllEvents(): Observable<EventShort[]> {
    return this.httpClient.get<EventShort[]>(`${this.URL}`);
  }

  getEventDesc(eventId: number): Observable<EventDesc> {
    return this.httpClient.get<EventDesc>(`${this.URL}/${eventId}`);
  }

  getComments(eventId: number): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${this.URL}/${eventId}/comments`);
  }

  postComment(eventId: number, comment: string) {
    return this.httpClient.post<Comment>(`${this.URL}/${eventId}/comments`, {
      content: comment,
    });
  }

  unFollowEvent(eventId: number) {
    console.log('unfollow');
    return this.httpClient.delete(`${this.URL}/favorites/${eventId}`);
  }

  followEvent(eventId: number) {
    console.log('follow');
    return this.httpClient.post(`${this.URL}/favorites`, { eventId: eventId });
  }
}
