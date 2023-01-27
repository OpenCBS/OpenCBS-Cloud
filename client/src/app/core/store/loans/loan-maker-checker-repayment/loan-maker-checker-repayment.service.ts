import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoanMakerCheckerRepaymentService {

  constructor(
    private httpClient: HttpClient) {
  }

  getLoanMakerCheckerRepayment(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}requests/${id}/content`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  public approveMakerChecker(id): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}requests/${id}/approve`,
      null,
      {responseType: 'text'})
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  public deleteMakerChecker(id): Observable<any> {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}requests/${id}/delete`,
      null,
      {responseType: 'text'})
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
