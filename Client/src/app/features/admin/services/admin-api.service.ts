import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AdminEvent } from '../../../shared/models/AdminEvent';
import { EventEdit } from '../../../shared/models/EventEdit';
import { AdminWorkshop } from '../../../shared/models/AdminWorkshop';
import { WorkshopEdit } from '../../../shared/models/WorkshopEdit';
import { UserData } from '../../../shared/models/UserData';
import { ListData } from '../../../shared/models/AdminListData';

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  private httpClient = inject(HttpClient);
  private URL = `http://localhost:5253/api/admin`;

  getUnverifiedEvents(pageIndex: number, pageSize: number) {
    return this.httpClient.get<ListData<AdminEvent[]>>(`${this.URL}/events`, {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    });
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

  getEventToEdit(eventId: number) {
    return this.httpClient.get<EventEdit>(`${this.URL}/event/${eventId}`);
  }

  updateEvent(data: FormData) {
    return this.httpClient.patch(`${this.URL}/event`, data, {
      responseType: 'text',
    });
  }

  getUnverifiedWorkshops(pageIndex: number, pageSize: number) {
    return this.httpClient.get<ListData<AdminWorkshop[]>>(
      `${this.URL}/workshops`,
      {
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
        },
      }
    );
  }

  verifyWorkshop(workshopId: number) {
    return this.httpClient.post(
      `${this.URL}/workshops`,
      { id: workshopId },
      { responseType: 'text' }
    );
  }

  deleteWorkshop(workshopId: number) {
    return this.httpClient.delete(`${this.URL}/workshops/${workshopId}`, {
      responseType: 'text',
    });
  }

  getWorkshopToEdit(workshopId: number) {
    return this.httpClient.get<WorkshopEdit>(
      `${this.URL}/workshop/${workshopId}`
    );
  }

  updateWorkshop(data: FormData) {
    return this.httpClient.patch(`${this.URL}/workshop`, data, {
      responseType: 'text',
    });
  }

  getUsersData(pageIndex: number, pageSize: number) {
    return this.httpClient.get<ListData<UserData[]>>(`${this.URL}/users`, {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    });
  }

  promoteUser(id: number) {
    return this.httpClient.post(
      `${this.URL}/user/promote`,
      { id: id },
      { responseType: 'text' }
    );
  }

  demoteUser(id: number) {
    return this.httpClient.post(
      `${this.URL}/user/demote`,
      { id: id },
      { responseType: 'text' }
    );
  }
}
