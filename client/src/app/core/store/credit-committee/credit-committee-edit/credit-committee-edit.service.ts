import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CCRulesUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateCCRules(holiday, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}credit-committee-amount-ranges/${id}`,
      JSON.stringify(holiday))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
