import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class LoanEventsService {

  constructor(private httpClient: HttpClient) {
  }

  getLoanEvents(loanId, status): Observable<any> {
    let url;
    if ( status ) {
      url = `loans/${loanId}/events?showDeleted=${status.showDeleted}&showSystem=${status.showSystem}`;
    } else {
      url = `loans/${loanId}/events`;
    }

    return this.httpClient.get(`${environment.API_ENDPOINT}${url}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getChildNotes(loanId, childNote): Observable<any> {
    return this.httpClient.get(`${environment.API_ENDPOINT}loans/${loanId}/events/${childNote}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
