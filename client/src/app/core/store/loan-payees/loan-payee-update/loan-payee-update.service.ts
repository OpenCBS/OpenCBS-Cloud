import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanPayeeUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateLoanPayee(loanApplicationId, loanPayee, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}loan-applications/${loanApplicationId}/payees/${id}`,
      JSON.stringify(loanPayee)).pipe(delay(environment.RESPONSE_DELAY));
  }

  disburseLoanPayee(loanApplicationId, payeeId, data) {
    const chequeNumber = data.chequeNumber;
    const disbursementDate = {
      disbursementDate: data.disbursementDate
    };

    return this.httpClient.put(
      `${environment.API_ENDPOINT}loan-applications/${loanApplicationId}/payees/${payeeId}/disburse?checknumber=${chequeNumber}`,
      JSON.stringify(disbursementDate)).pipe(delay(environment.RESPONSE_DELAY));
  }

  refundLoanPayee(payeeId: number, comment: any) {
    return this.httpClient.post(`${environment.API_ENDPOINT}loan-applications/payees/${payeeId}/refund`,
      JSON.stringify(comment)).pipe(delay(environment.RESPONSE_DELAY));
  }
}
