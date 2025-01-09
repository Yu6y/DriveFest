import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventShort } from '../../../shared/models/EventShort';
import { EventDesc } from '../../../shared/models/EventDesc';
import { Comment } from '../../../shared/models/Comment';
import { Tag } from '../../../shared/models/Tag';
import { EventListFiltersFormValue } from '../components/event-filters/event-filters.component';

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

  getEventsFiltered(searchParams: EventListFiltersFormValue) {
    return this.httpClient.get<EventShort[]>(`${this.URL}/filters`, {
      params: {
        ...searchParams,
        tags: searchParams.tags.map((tag) => tag.id).join(','),
        voivodeships: searchParams.voivodeships.map((v) => v).join(','),
      },
    });
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
    return this.httpClient.delete(`${this.URL}/favorites/${eventId}`);
  }

  followEvent(eventId: number) {
    return this.httpClient.post(`${this.URL}/favorites`, { eventId: eventId });
  }

  getFavoriteEvents(): Observable<EventShort[]> {
    return this.httpClient.get<EventShort[]>(`${this.URL}/favorites`);
  }

  getTags(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(`${this.URL}/tags`);
  }

  addEvent(event: FormData) {
    return this.httpClient.post(`${this.URL}`, event);
  }
}
