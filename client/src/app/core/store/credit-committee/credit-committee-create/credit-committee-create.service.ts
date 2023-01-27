import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CCRuleCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createCCRule(ccRule) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}credit-committee-amount-ranges`,
      JSON.stringify(ccRule))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
