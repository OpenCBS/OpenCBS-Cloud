import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../environments/environment';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class SavingEntriesService {

  constructor(private httpClient: HttpClient) {
  }

  getSavingEntries(savingId, page): Observable<any> {
    let url;
    if ( page ) {
      url = `${environment.API_ENDPOINT}savings/${savingId}/entries?page=${page - 1}`
    } else {
      url = `${environment.API_ENDPOINT}savings/${savingId}/entries`
    }
    return this.httpClient.get(url)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
