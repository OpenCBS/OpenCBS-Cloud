import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OtherFeeCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createOtherFee(otherFee) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}other-fees`,
      JSON.stringify(otherFee))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
