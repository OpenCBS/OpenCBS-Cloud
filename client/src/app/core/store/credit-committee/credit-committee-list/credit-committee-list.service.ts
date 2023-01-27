import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CCRulesListService {

  constructor(private httpClient: HttpClient) {
  }

  getCCRulesList(): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}credit-committee-amount-ranges`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
