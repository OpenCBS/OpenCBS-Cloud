import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EntryFeeCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createEntryFee(entryFee) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}entry-fees`,
      JSON.stringify(entryFee))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
