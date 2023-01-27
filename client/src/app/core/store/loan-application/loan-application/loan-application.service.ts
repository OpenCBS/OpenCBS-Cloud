import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanApplicationService {

  constructor(private httpClient: HttpClient) {
  }

  getLoanApplication(id) {
    return this.httpClient.get(`${environment.API_ENDPOINT}loan-applications/${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  changeCCStatus(loanAppId, status) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}loan-applications/${loanAppId}/change-status`,
      JSON.stringify(status),
      {observe: 'response'})
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  submitLoanApplication(loanAppId) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}loan-applications/${loanAppId}/submit`,
      null)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  disburseLoanApplication(loanAppId) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}loan-applications/${loanAppId}/disburse`,
      null)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
