import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EntryFeeUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateEntryFee(entryFee, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}entry-fees/${id}`,
      JSON.stringify(entryFee))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
