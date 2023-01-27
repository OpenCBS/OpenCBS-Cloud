import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EventService {

  constructor(private httpClient: HttpClient) {
  }

  getEvents(date: string, userId: number, monthNum?: number) {
    return this.httpClient.get<any>(
      `${environment.API_ENDPOINT}task-events/${userId}?date=${date}${monthNum ? '&monthNum=' + monthNum : ''}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  createEvent(event) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}task-events`,
      JSON.stringify(event));
  }

  updateEvent(event) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}task-events/${event.createdBy}/${event.id}`, event);
  };
}
