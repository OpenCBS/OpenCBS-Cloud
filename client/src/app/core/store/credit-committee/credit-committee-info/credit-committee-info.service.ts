import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CCRulesInfoService {

  constructor(private httpClient: HttpClient) {
  }

  getCCRulesInfo(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}credit-committee-amount-ranges/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
