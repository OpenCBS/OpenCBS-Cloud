import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanInfoService {
  private urlLoan: string;

  constructor(private httpClient: HttpClient) {
  }

  loadLoanInfo(id, loanType) {
    if ( loanType === 'group' ) {
      this.urlLoan = 'group-loans/'
    } else {
      this.urlLoan = 'loans/'
    }
    return this.httpClient.get(`${environment.API_ENDPOINT}${this.urlLoan}${id}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}
