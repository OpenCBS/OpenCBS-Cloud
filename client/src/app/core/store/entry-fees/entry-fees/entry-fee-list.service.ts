import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EntryFeeListService {

  constructor(private httpClient: HttpClient) {
  }

  getEntryFeeList(): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}entry-fees`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
