import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OtherFeeUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateOtherFee(otherFee, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}other-fees/${id}`,
      JSON.stringify(otherFee))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
