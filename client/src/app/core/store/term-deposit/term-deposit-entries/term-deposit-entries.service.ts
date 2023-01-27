import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class TermDepositEntriesService {

  constructor(private httpClient: HttpClient) {
  }

  getTermDepositEntries(termDepositId, page): Observable<any> {
    let url;
    if ( page ) {
      url = `${environment.API_ENDPOINT}term-deposits/${termDepositId}/entries?page=${page - 1}`
    } else {
      url = `${environment.API_ENDPOINT}term-deposits/${termDepositId}/entries`
    }
    return this.httpClient.get(url)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
