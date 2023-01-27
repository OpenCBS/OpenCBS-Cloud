import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { environment } from '../../../../../environments/environment';

import { ILoanAppMakerCheckerDisburseState } from './loan-app-maker-checker-disburse.reducer';
import * as LoanAppMakerCheckerDisburseActions from './loan-app-maker-checker-disburse.actions';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanAppMakerCheckerDisburseService {

  constructor(private httpClient: HttpClient) {
  }

  getLoanAppMakerChecker(id) {
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
