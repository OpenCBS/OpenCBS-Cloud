import { catchError, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class BorrowingEventsService {

  constructor(private httpClient: HttpClient) {
  }

  getBorrowingEvents(borrowingId, status): Observable<any> {
    let url;
    if ( status ) {
      url = `borrowings/${borrowingId}/events?showDeleted=${status.showDeleted}&showSystem=${status.showSystem}`;
    } else {
      url = `borrowings/${borrowingId}/events`;
    }

    return this.httpClient.get(
      `${environment.API_ENDPOINT}${url}`).pipe(delay(environment.RESPONSE_DELAY));
  }

  getChildNotes(borrowingId, childNote): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}borrowings/${borrowingId}/events/${childNote}`)
      .pipe(delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => of(err.error)));
  }
}
