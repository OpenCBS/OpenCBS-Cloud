import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class LoanAppCCActivityListService {

  constructor(private httpClient: HttpClient) {
  }

  getLoanAppCCActivityList(loanAppId): Observable<any> {
    return this.httpClient.get(
      `${environment.API_ENDPOINT}loan-applications/${loanAppId}/credit-committee-vote-history`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

}
