import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class BondEventsService {

  constructor(private httpClient: HttpClient) {
  }

  getBondEvents(bondId, status): Observable<any> {
    let url;
    if ( status ) {
      url = `bonds/${bondId}/events?showDeleted=${status.showDeleted}&showSystem=${status.showSystem}`;
    } else {
      url = `bonds/${bondId}/events`;
    }

    return this.httpClient.get(
      `${environment.API_ENDPOINT}${url}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  getChildNotes(bondId, childNote): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}bonds/${bondId}/events/${childNote}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
