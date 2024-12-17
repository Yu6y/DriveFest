import { inject, Injectable } from '@angular/core';
import { WorkshopShort } from '../../../shared/models/WorkshopShort';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../../../shared/models/Tag';
import { WorkshopListFiltersFormValue } from '../components/workshop-filters/workshop-filters.component';
import { WorkshopDesc } from '../../../shared/models/WorkshopDesc';
import { Observable } from 'rxjs';
import { Comment } from '../../../shared/models/Comment';

@Injectable({
  providedIn: 'root',
})
export class WorkshopApiService {
  private httpClient = inject(HttpClient);
  private URL = 'https://drivefest.azurewebsites.net/api/workshop';

  getAllWorkshops(): Observable<WorkshopShort[]> {
    return this.httpClient.get<WorkshopShort[]>(`${this.URL}`);
  }

  getWorkshopsTags(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(`${this.URL}/tags`);
  }

  getFilteredWorkshops(
    searchParams: WorkshopListFiltersFormValue
  ): Observable<WorkshopShort[]> {
    return this.httpClient.get<WorkshopShort[]>(`${this.URL}/filters`, {
      params: {
        ...searchParams,
        tags: searchParams.tags.map((tag) => tag.id).join(','),
        voivodeships: searchParams.voivodeships.map((v) => v).join(','),
      },
    });
  }

  getWorkshopDesc(workshopId: number): Observable<WorkshopDesc> {
    return this.httpClient.get<WorkshopDesc>(`${this.URL}/${workshopId}`);
  }

  getComments(workshopId: number): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${this.URL}/${workshopId}/comments`);
  }

  postComment(workshopId: number, comment: string) {
    return this.httpClient.post<Comment>(`${this.URL}/${workshopId}/comments`, {
      content: comment,
    });
  }

  addWorkshop(workshop: FormData) {
    return this.httpClient.post(`${this.URL}`, workshop);
  }

  rateWorkshop(rate: number, workshopId: number) {
    return this.httpClient.post<number>(`${this.URL}/rate`, {
      workshopId: workshopId,
      rate: rate,
    });
  }

  getWorkshopRate(workshopId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.URL}/rate/${workshopId}`);
  }
}
