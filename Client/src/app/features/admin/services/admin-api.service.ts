import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AdminEvent } from '../../../shared/models/AdminEvent';

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  private httpClient = inject(HttpClient);
  private URL = `http://localhost:5253/api/admin`;

  getUnverifiedEvents() {
    return this.httpClient.get<AdminEvent[]>(`${this.URL}/events`);
  }

  verifyEvent(eventId: number) {
    return this.httpClient.post(
      `${this.URL}/events`,
      { eventId: eventId },
      { responseType: 'text' }
    );
  }

  deleteEvent(eventId: number) {
    return this.httpClient.delete(`${this.URL}/events/${eventId}`, {
      responseType: 'text',
    });
  }
}
