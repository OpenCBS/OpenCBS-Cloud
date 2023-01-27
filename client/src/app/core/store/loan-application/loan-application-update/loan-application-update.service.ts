import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanApplicationUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateLoanApplication(loanApplication, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}loan-applications/${id}`,
      JSON.stringify(loanApplication))
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  disbursePayee(loanAppId, payeeId, date) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}loan-applications/${loanAppId}/payees/${payeeId}/disburse`,
      JSON.stringify(date))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
