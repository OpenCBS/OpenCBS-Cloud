import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class LoanPayeeEventsService {

  constructor(private httpClient: HttpClient) {
  }

  getLoanPayeeEvents(payeeId): Observable<any> {
    const url = `loan-applications/loan-application-payee-events/${payeeId}`;

    return this.httpClient.get(
      `${environment.API_ENDPOINT}${url}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getChildNotes(payeeId, childNote): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}loan-applications/loan-application-payee-events/${payeeId}/events/${childNote}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
